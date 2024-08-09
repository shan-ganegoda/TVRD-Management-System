import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {BloodType} from "../../core/entity/bloodtype";
import {MotherStatus} from "../../core/entity/motherstatus";
import {InvolvementStatus} from "../../core/entity/involvementstatus";
import {Clinic} from "../../core/entity/clinic";
import {QRCodeModule} from "angularx-qrcode";
import html2canvas from "html2canvas-pro";
import {jsPDF} from "jspdf";
import {PublicService} from "../../core/service/public/public.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../dialog/warning-dialog/warning-dialog.component";
import {Mother} from "../../core/entity/mother";
import {ConfirmDialogComponent} from "../dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../core/util/toast/toast.service";

@Component({
  selector: 'app-motherregpublic',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    QRCodeModule
  ],
  templateUrl: './motherregpublic.component.html',
  styleUrl: './motherregpublic.component.scss'
})
export class MotherregpublicComponent implements OnInit{

  qrData: string = "QR Data";

  @ViewChild('qrcode', {static: true}) el!: ElementRef<HTMLImageElement>
  ifqrshow: boolean = false;

  today:any;
  regexes:any

  bloodtypes: BloodType[] = [{id:1,name:"O+"},{id:2,name:"O-"},{id:3,name:"A+"},{id:4,name:"A-"},{id:5,name:"B+"},{id:6,name:"B-"},{id:7,name:"AB+"},{id:8,name:"AB-"},];
  motherstatuses: MotherStatus[] = [{id:1,name:"Pregnant"},{id:2,name:"Lactating"}];
  involvementstatuses: InvolvementStatus[] = [{id:1,name:"On Program"},{id:2,name:"Off Program"},{id:3,name:"Suspended"}];
  maritalstatuses: InvolvementStatus[] = [{id:1,name:"Married"},{id:2,name:"Divorced"},{id:3,name:"Widowed"}];
  clinics: Clinic[] = [];
  mothers: Mother[] = [];

  motherRegPublicForm:FormGroup;

  constructor(
    private fb:FormBuilder,
    private ps:PublicService,
    private dialog: MatDialog,
    private tst: ToastService
  ) {
    this.motherRegPublicForm = this.fb.group({
      "mothername": new FormControl('',[Validators.required]),
      "clinic": new FormControl(null,[Validators.required]),
      "nic": new FormControl('',[Validators.required]),
      "mobileno": new FormControl('',[Validators.required]),
      "dopregnant": new FormControl('',[Validators.required]),
      "bloodtype": new FormControl(null,[Validators.required]),
      "maritalstatus": new FormControl(null,[Validators.required]),
      "age": new FormControl('',[Validators.required]),
      "address": new FormControl('',[Validators.required]),
      "currentweight": new FormControl('',[Validators.required]),
      "description": new FormControl('',[Validators.required]),
      "motherstatus": new FormControl(null,[Validators.required]),
    });
  }
  ngOnInit(): void {
    this.today = new Date();

    this.initialize();
  }

  initialize(){


    this.ps.getClinics().subscribe({
      next:data => {
        this.clinics = data;
        // @ts-ignore
        this.clinics.sort((a, b) => a.divisionname.localeCompare(b.divisionname))
      },
    });

    this.ps.getAllM("").subscribe({
      next:data => {
        this.mothers = data
        this.generateRegNo();
      },

    });

    this.ps.getRegexes().subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });

  }

  createForm() {

    this.motherRegPublicForm.controls['mothername'].setValidators([Validators.required, Validators.pattern(this.regexes['mothername']['regex'])]);
    this.motherRegPublicForm.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.motherRegPublicForm.controls['mobileno'].setValidators([Validators.required, Validators.pattern(this.regexes['mobileno']['regex'])]);
    this.motherRegPublicForm.controls['dopregnant'].setValidators([Validators.required]);
    this.motherRegPublicForm.controls['age'].setValidators([Validators.required, Validators.pattern(this.regexes['age']['regex'])]);
    this.motherRegPublicForm.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
    this.motherRegPublicForm.controls['currentweight'].setValidators([Validators.required, Validators.pattern(this.regexes['currentweight']['regex'])]);
    this.motherRegPublicForm.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.motherRegPublicForm.controls['clinic'].setValidators([Validators.required]);
    this.motherRegPublicForm.controls['bloodtype'].setValidators([Validators.required]);
    this.motherRegPublicForm.controls['maritalstatus'].setValidators([Validators.required]);
    this.motherRegPublicForm.controls['motherstatus'].setValidators([Validators.required]);

  }

  loadQR(regno: string, name: string) {
    const data = {registerno: regno, mothername: name}
    this.ifqrshow = true;
    this.qrData = JSON.stringify(data);
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.motherRegPublicForm.controls) {
      const control = this.motherRegPublicForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  add(){
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Mother Add ", message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.motherRegPublicForm.valid) {

        const mother: Mother = {
          registerno: this.generateRegNo(),
          mothername: this.motherRegPublicForm.controls['mothername'].value,
          mobileno: this.motherRegPublicForm.controls['mobileno'].value,
          nic: this.motherRegPublicForm.controls['nic'].value,
          dopregnant: this.motherRegPublicForm.controls['dopregnant'].value,
          age: this.motherRegPublicForm.controls['age'].value,
          address: this.motherRegPublicForm.controls['address'].value,
          description: this.motherRegPublicForm.controls['description'].value,
          currentweight: this.motherRegPublicForm.controls['currentweight'].value,

          clinic: {id: parseInt(this.motherRegPublicForm.controls['clinic'].value)},
          motherstatus: {id: parseInt(this.motherRegPublicForm.controls['motherstatus'].value)},
          bloodtype: {id: parseInt(this.motherRegPublicForm.controls['bloodtype'].value)},
          involvementstatus: {id: 1},
          maritalstatus: {id: parseInt(this.motherRegPublicForm.controls['maritalstatus'].value)},
        }

        this.ifqrshow = true;

        this.loadQR(this.generateRegNo(), this.motherRegPublicForm.controls['mothername'].value);

        const msg = "Enroll Mother " + mother.mothername;

        this.dialog.open(ConfirmDialogComponent, {data: msg})
          .afterClosed().subscribe(res => {
          if (res) {
            this.ps.saveMother(mother).subscribe({
              next: () => {
                //this.downloadAsPDF();
                this.tst.handleResult('success', "Mother Saved Successfully");
                this.clearForm();
              },
              error: (err: any) => {
                this.tst.handleResult('Failed', err.error.data.message);
              }
            });
          }
        });
      }
    }
  }

  clearForm() {
    this.motherRegPublicForm.reset();
    this.motherRegPublicForm.controls['clinic'].setValue(null);
    this.motherRegPublicForm.controls['bloodtype'].setValue(null);
    this.motherRegPublicForm.controls['maritalstatus'].setValue(null);
  }

  generateRegNo() {
    const numbers = this.mothers.map(n => {
      const parts = n.registerno?.split('-');
      return parts ? parseInt(parts[2]) : 0;
    });


    const maxno = Math.max(...numbers);
    const nextno = maxno + 1;
    const formattedLastNumber = nextno.toString().padStart(3, '0');
    const middleNumber = '128'; // This can be static or dynamically generated if needed

    const formattedNextNumber = `A-128-${formattedLastNumber}`;
    console.log(formattedNextNumber)
    return formattedNextNumber;
  }

  downloadAsPDF(): void {
    const element: HTMLElement | null = document.getElementById('qrcode');
    if (element) {
      element.style.backgroundColor = 'white';
      html2canvas(element).then((canvas: HTMLCanvasElement) => {
        const imgData: string = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [50, 50] // Set the PDF size to 50mm x 50mm
        });
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        // Adjust the image dimensions and position as needed
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        const data = JSON.parse(this.qrData)
        pdf.save(`${data.registerno}.pdf`);
      }).catch(error => {
        console.error('Error generating canvas:', error);
      });
    } else {
      console.error('Element with id "qrcode" not found.');
    }
  }



}
