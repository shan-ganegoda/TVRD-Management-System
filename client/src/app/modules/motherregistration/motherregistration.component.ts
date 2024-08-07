import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Mother} from "../../core/entity/mother";
import {BloodType} from "../../core/entity/bloodtype";
import {InvolvementStatus} from "../../core/entity/involvementstatus";
import {MaritalStatus} from "../../core/entity/maritalstatus";
import {Clinic} from "../../core/entity/clinic";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {ClinicService} from "../../core/service/clinic/clinic.service";
import {MotherService} from "../../core/service/motherregistration/mother.service";
import {BloodtypeService} from "../../core/service/motherregistration/bloodtype.service";
import {InvolvementstatusService} from "../../core/service/motherregistration/involvementstatus.service";
import {MaritalstatusService} from "../../core/service/motherregistration/maritalstatus.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {ToastService} from "../../core/util/toast/toast.service";
import {MotherStatus} from "../../core/entity/motherstatus";
import {MotherstatusService} from "../../core/service/motherregistration/motherstatus.service";
import {QRCodeModule} from "angularx-qrcode";
import html2canvas from "html2canvas-pro";
import {jsPDF} from "jspdf";

@Component({
  selector: 'app-motherregistration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatGridList,
    MatGridTile,
    AsyncPipe,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent,
    QRCodeModule
  ],
  templateUrl: './motherregistration.component.html',
  styleUrl: './motherregistration.component.scss'
})
export class MotherregistrationComponent implements OnInit {

  qrData: string = "QR Data";

  @ViewChild('qrcode', {static: true}) el!: ElementRef<HTMLImageElement>

  motherregForm!: FormGroup;
  motherregSearchForm!: FormGroup;

  isLoading = false;
  isFailed = false;

  currentMother!: Mother;
  oldMother!: Mother;

  ifqrshow: boolean = false;

  mothers: Mother[] = [];
  bloodtypes: BloodType[] = [];
  involvementstatuses: InvolvementStatus[] = [];
  maritalstatuses: MaritalStatus[] = [];
  clinics: Clinic[] = [];
  motherstatuses: MotherStatus[] = [];

  dataSource!: MatTableDataSource<Mother>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  regexes: any;

  currentOperation = '';

  hasUpdateAuthority = this.am.hasAuthority("Mother-Update");
  hasDeleteAuthority = this.am.hasAuthority("Mother-Delete");
  hasReadAuthority = this.am.hasAuthority("Mother-Read");
  hasWriteAuthority = this.am.hasAuthority("Mother-Write");

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  constructor(
    private cs: ClinicService,
    private ms: MotherService,
    private bts: BloodtypeService,
    private iss: InvolvementstatusService,
    private mts: MaritalstatusService,
    private rs: RegexService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private am: AuthorizationService,
    private tst: ToastService,
    private mss: MotherstatusService
  ) {

    this.motherregSearchForm = this.fb.group({
      "ssmothername": new FormControl(''),
      "ssregisterno": new FormControl(''),
      "ssnic": new FormControl(''),
      "ssclinic": new FormControl(''),
    }, {updateOn: "change"});

    this.motherregForm = this.fb.group({
      "registerno": new FormControl('', [Validators.required]),
      "mothername": new FormControl('', [Validators.required]),
      "nic": new FormControl('', [Validators.required]),
      "mobileno": new FormControl('', [Validators.required]),
      "dopregnant": new FormControl('', [Validators.required]),
      "age": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "currentweight": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "clinic": new FormControl(null, [Validators.required]),
      "bloodtype": new FormControl(null, [Validators.required]),
      "maritalstatus": new FormControl(null, [Validators.required]),
      "involvementstatus": new FormControl(null, [Validators.required]),
      "motherstatus": new FormControl(null, [Validators.required]),
    }, {updateOn: "change"});
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadTable("");

    this.cs.getAllList().subscribe({
      next: data => {
        this.clinics = data;
        // @ts-ignore
        this.clinics.sort((a, b) => a.divisionname.localeCompare(b.divisionname))
      },
    });

    this.bts.getAll().subscribe({
      next: data => this.bloodtypes = data,
    });

    this.mss.getAll().subscribe({
      next: data => this.motherstatuses = data,
    });

    this.iss.getAll().subscribe({
      next: data => this.involvementstatuses = data,
    });

    this.mts.getAll().subscribe({
      next: data => this.maritalstatuses = data,
    });

    this.rs.getRegexes('mother').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query: string) {
    this.ms.getAll(query).subscribe({
      next: data => {
        this.mothers = data;
        this.dataSource = new MatTableDataSource(this.mothers);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  loadQR(regno: string, name: string) {
    const data = {registerno: regno, mothername: name}
    this.qrData = JSON.stringify(data)
  }

  createForm() {
    this.motherregForm.controls['registerno'].setValidators([Validators.required, Validators.pattern(this.regexes['registerno']['regex'])]);
    this.motherregForm.controls['mothername'].setValidators([Validators.required, Validators.pattern(this.regexes['mothername']['regex'])]);
    this.motherregForm.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.motherregForm.controls['mobileno'].setValidators([Validators.required, Validators.pattern(this.regexes['mobileno']['regex'])]);
    this.motherregForm.controls['dopregnant'].setValidators([Validators.required]);
    this.motherregForm.controls['age'].setValidators([Validators.required, Validators.pattern(this.regexes['age']['regex'])]);
    this.motherregForm.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
    this.motherregForm.controls['currentweight'].setValidators([Validators.required, Validators.pattern(this.regexes['currentweight']['regex'])]);
    this.motherregForm.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.motherregForm.controls['clinic'].setValidators([Validators.required]);
    this.motherregForm.controls['bloodtype'].setValidators([Validators.required]);
    this.motherregForm.controls['maritalstatus'].setValidators([Validators.required]);
    this.motherregForm.controls['involvementstatus'].setValidators([Validators.required]);
    this.motherregForm.controls['motherstatus'].setValidators([Validators.required]);

    for (const controlName in this.motherregForm.controls) {
      const control = this.motherregForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldMother != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentMother[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }
    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean) {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  fillForm(mother: Mother) {
    this.enableButtons(false, true, true);

    this.currentMother = mother;
    this.oldMother = this.currentMother;

    //console.log(this.currentMother);


    this.motherregForm.setValue({
      mothername: this.currentMother.mothername,
      registerno: this.currentMother.registerno,
      nic: this.currentMother.nic,
      mobileno: this.currentMother.mobileno,
      dopregnant: this.currentMother.dopregnant,
      age: this.currentMother.age,
      address: this.currentMother.address,
      currentweight: this.currentMother.currentweight,
      description: this.currentMother.description,

      clinic: this.currentMother.clinic?.id,
      motherstatus: this.currentMother.motherstatus?.id,
      bloodtype: this.currentMother.bloodtype?.id,
      maritalstatus: this.currentMother.maritalstatus?.id,
      involvementstatus: this.currentMother.involvementstatus?.id,

    });

    this.ifqrshow = true;
    if (this.currentMother.registerno != null && this.currentMother.mothername != null) {
      this.loadQR(this.currentMother.registerno, this.currentMother.mothername);
    }

    this.motherregForm.markAsPristine();
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.motherregForm.controls) {
      const control = this.motherregForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.motherregForm.controls) {
      const control = this.motherregForm.controls[controlName];
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

  add() {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Mother Add ", message: "You Have Following Errors <br/> " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.motherregForm.valid) {

        const mother: Mother = {
          registerno: this.motherregForm.controls['registerno'].value,
          mothername: this.motherregForm.controls['mothername'].value,
          mobileno: this.motherregForm.controls['mobileno'].value,
          nic: this.motherregForm.controls['nic'].value,
          dopregnant: this.motherregForm.controls['dopregnant'].value,
          age: this.motherregForm.controls['age'].value,
          address: this.motherregForm.controls['address'].value,
          description: this.motherregForm.controls['description'].value,
          currentweight: this.motherregForm.controls['currentweight'].value,

          clinic: {id: parseInt(this.motherregForm.controls['clinic'].value)},
          motherstatus: {id: parseInt(this.motherregForm.controls['motherstatus'].value)},
          bloodtype: {id: parseInt(this.motherregForm.controls['bloodtype'].value)},
          involvementstatus: {id: parseInt(this.motherregForm.controls['involvementstatus'].value)},
          maritalstatus: {id: parseInt(this.motherregForm.controls['maritalstatus'].value)},
        }

        //this.loadQR(this.motherregForm.controls['registerno'].value, this.motherregForm.controls['mothername'].value);

        this.currentOperation = "Add Mother " + mother.registerno;

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.ms.save(mother).subscribe({
              next: () => {
                //this.downloadAsPDF();
                this.tst.handleResult('success', "Mother Saved Successfully");
                this.loadTable("");
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

  update(currentMother: Mother) {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Mother Update ", message: "You Have Following Errors <br/> " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - Mother Update ", message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if (!res) {
            return;
          } else {

            const mother: Mother = {
              registerno: this.motherregForm.controls['registerno'].value,
              mothername: this.motherregForm.controls['mothername'].value,
              mobileno: this.motherregForm.controls['mobileno'].value,
              nic: this.motherregForm.controls['nic'].value,
              dopregnant: this.motherregForm.controls['dopregnant'].value,
              age: this.motherregForm.controls['age'].value,
              address: this.motherregForm.controls['address'].value,
              description: this.motherregForm.controls['description'].value,
              currentweight: this.motherregForm.controls['currentweight'].value,

              clinic: {id: parseInt(this.motherregForm.controls['clinic'].value)},
              motherstatus: {id: parseInt(this.motherregForm.controls['motherstatus'].value)},
              bloodtype: {id: parseInt(this.motherregForm.controls['bloodtype'].value)},
              involvementstatus: {id: parseInt(this.motherregForm.controls['involvementstatus'].value)},
              maritalstatus: {id: parseInt(this.motherregForm.controls['maritalstatus'].value)},
            }

            mother.id = currentMother.id;

            this.currentOperation = "Update Mother " + mother.registerno;

            this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
              .afterClosed().subscribe(res => {
              if (res) {
                this.ms.update(mother).subscribe({
                  next: () => {
                    this.tst.handleResult('success', "Mother Updated Successfully");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error: (err: any) => {
                    this.tst.handleResult('Failed', err.error.data.message);
                  }
                });
              }
            })
          }
        });

      } else {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - Mother Update ", message: "No Fields Updated "}
        }).afterClosed().subscribe(res => {
          if (res) {
            return;
          }
        })
      }
    }
  }

  delete(currentMother: Mother) {
    const operation = "Delete Mother " + currentMother.registerno;

    this.dialog.open(ConfirmDialogComponent, {data: operation})
      .afterClosed().subscribe((res: boolean) => {
      if (res) {
        if (currentMother.id) {
          this.ms.delete(currentMother.id).subscribe({
            next: () => {
              this.loadTable("");
              this.tst.handleResult('success', "Mother Delete Successfully");
              this.clearForm();
            },
            error: (err: any) => {
              this.tst.handleResult('Failed', err.error.data.message);
              console.log(err);
            },
          });
        } else {
          this.tst.handleResult('Failed', " Employee Id Not Found!");
        }
      }
    });
  }

  clearForm() {
    this.motherregForm.reset();
    this.motherregForm.controls['clinic'].setValue(null);
    this.motherregForm.controls['bloodtype'].setValue(null);
    this.motherregForm.controls['involvementstatus'].setValue(null);
    this.motherregForm.controls['maritalstatus'].setValue(null);
    this.ifqrshow = false;

    this.enableButtons(true, false, false);
  }

  handleSearch() {
    const ssmothername = this.motherregSearchForm.controls['ssmothername'].value;
    const ssregisterno = this.motherregSearchForm.controls['ssregisterno'].value;
    const ssnic = this.motherregSearchForm.controls['ssnic'].value;
    const ssclinic = this.motherregSearchForm.controls['ssclinic'].value;

    let query = ""

    if (ssmothername != null && ssmothername.trim() != "") query = query + "&mothername=" + ssmothername;
    if (ssregisterno != null && ssregisterno.trim() != "") query = query + "&registerno=" + ssregisterno;
    if (ssnic != null && ssnic.trim() != "") query = query + "&nic=" + ssnic;
    if (ssclinic != '') query = query + "&clinicid=" + parseInt(ssclinic);

    if (query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    this.dialog.open(ConfirmDialogComponent, {data: "Clear Search"}
    ).afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.motherregSearchForm.reset();
        this.motherregSearchForm.controls['ssclinic'].setValue('');
        this.loadTable("");
      }
    });
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
    this.motherregForm.controls['registerno'].setValue(formattedNextNumber);
  }
}
