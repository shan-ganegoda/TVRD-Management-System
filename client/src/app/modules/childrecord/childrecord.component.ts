import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Mother} from "../../core/entity/mother";
import {HealthStatus} from "../../core/entity/healthstatus";
import {ChildRecord} from "../../core/entity/childrecord";
import {BloodType} from "../../core/entity/bloodtype";
import {Gender} from "../../core/entity/gender";
import {InvolvementStatus} from "../../core/entity/involvementstatus";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {GenderService} from "../../core/service/employee/gender.service";
import {MotherService} from "../../core/service/motherregistration/mother.service";
import {InvolvementstatusService} from "../../core/service/motherregistration/involvementstatus.service";
import {HealthstatusService} from "../../core/service/childrecords/healthstatus.service";
import {BloodtypeService} from "../../core/service/motherregistration/bloodtype.service";
import {ChildrecordService} from "../../core/service/childrecords/childrecord.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastService} from "../../core/util/toast/toast.service";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {ClinicService} from "../../core/service/clinic/clinic.service";
import {Clinic} from "../../core/entity/clinic";

@Component({
  selector: 'app-childrecord',
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
    PageLoadingComponent
  ],
  templateUrl: './childrecord.component.html',
  styleUrl: './childrecord.component.scss'
})
export class ChildrecordComponent implements OnInit{

  childRecordForm!:FormGroup;
  childRecordSearchForm!:FormGroup;

  isLoading = false;
  isFailed = false;

  currentChildRecord!:ChildRecord;
  oldChildRecord!:ChildRecord;

  mothers:Mother[] = [];
  healthstatuses:HealthStatus[] = [];
  childs:ChildRecord[] = [];
  clinics:Clinic[] =[];
  bloodtypes:BloodType[] = [];
  genders:Gender[] = [];
  involvementstatuses:InvolvementStatus[] = [];

  dataSource!: MatTableDataSource<ChildRecord>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  regexes:any;
  datetoday!:any;

  currentOperation = '';

  hasUpdateAuthority = this.am.hasAuthority("Child Record-Update");
  hasDeleteAuthority = this.am.hasAuthority("Child Record-Delete");
  hasReadAuthority = this.am.hasAuthority("Child Record-Read");
  hasWriteAuthority = this.am.hasAuthority("Child Record-Write");

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
              private fb:FormBuilder,
              private gs:GenderService,
              private ms:MotherService,
              private is:InvolvementstatusService,
              private hs:HealthstatusService,
              private bs:BloodtypeService,
              private cs:ChildrecordService,
              private rs:RegexService,
              private dialog:MatDialog,
              private tst:ToastService,
              private cdr:ChangeDetectorRef,
              private am: AuthorizationService,
              private cls:ClinicService
  ) {

    const today = new Date();
    this.datetoday = today.toISOString().split('T')[0];

    this.childRecordSearchForm = this.fb.group({
      "ssregno": new FormControl(''),
      "ssfullname": new FormControl(''),
      "ssgender": new FormControl(''),
      "ssclinic": new FormControl(''),
      "sshealthstatus": new FormControl(''),
    },{updateOn:'change'});

    this.childRecordForm = this.fb.group({
      "fullname": new FormControl("",[Validators.required]),
      "regno": new FormControl("",[Validators.required]),
      "dobirth": new FormControl("",[Validators.required]),
      "doregistered": [{value:this.datetoday, disabled:true}],
      "birthweight": new FormControl("",[Validators.required]),
      "headperimeter": new FormControl("",[Validators.required]),
      "heightinbirth": new FormControl("",[Validators.required]),
      "placeofbirth": new FormControl("",[Validators.required]),
      "apgarscore": new FormControl("",[Validators.required]),

      "gender": new FormControl(null,[Validators.required]),
      "clinic": new FormControl(null,[Validators.required]),
      "mother": new FormControl(null,[Validators.required]),
      "bloodtype": new FormControl(null,[Validators.required]),
      "healthstatus": new FormControl(null,[Validators.required]),
      "involvementstatus": new FormControl(null,[Validators.required]),
    },{updateOn:'change'});
  }

  ngOnInit() {
    this.initialize();

  }

  initialize(){
    this.loadTable("");

    this.gs.getGenderList().subscribe({
      next:data => this.genders = data,
    });

    this.cls.getAllList().subscribe({
      next:data => this.clinics = data,
    });

    this.hs.getAll().subscribe({
      next:data => this.healthstatuses = data,
    });

    this.ms.getAll("").subscribe({
      next:data => this.mothers = data,
    });

    this.bs.getAll().subscribe({
      next:data => this.bloodtypes = data,
    });

    this.is.getAll().subscribe({
      next:data => this.involvementstatuses = data,
    });

    this.rs.getRegexes('childrecord').subscribe({
      next:data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query:string){
    this.cs.getAll(query).subscribe({
      next:data =>{
        this.childs = data;
        this.dataSource = new MatTableDataSource(this.childs);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm(){
    this.childRecordForm.controls['fullname'].setValidators([Validators.required,Validators.pattern(this.regexes['fullname']['regex'])]);
    this.childRecordForm.controls['regno'].setValidators([Validators.required,Validators.pattern(this.regexes['regno']['regex'])]);
    this.childRecordForm.controls['dobirth'].setValidators([Validators.required]);
    this.childRecordForm.controls['doregistered'].setValidators([Validators.required]);
    this.childRecordForm.controls['birthweight'].setValidators([Validators.required,Validators.pattern(this.regexes['birthweight']['regex'])]);
    this.childRecordForm.controls['headperimeter'].setValidators([Validators.required,Validators.pattern(this.regexes['headperimeter']['regex'])]);
    this.childRecordForm.controls['heightinbirth'].setValidators([Validators.required,Validators.pattern(this.regexes['heightinbirth']['regex'])]);
    this.childRecordForm.controls['placeofbirth'].setValidators([Validators.required,Validators.pattern(this.regexes['placeofbirth']['regex'])]);
    this.childRecordForm.controls['apgarscore'].setValidators([Validators.required,Validators.pattern(this.regexes['apgarscore']['regex'])]);
    this.childRecordForm.controls['gender'].setValidators([Validators.required]);
    this.childRecordForm.controls['mother'].setValidators([Validators.required]);
    this.childRecordForm.controls['bloodtype'].setValidators([Validators.required]);
    this.childRecordForm.controls['healthstatus'].setValidators([Validators.required]);
    this.childRecordForm.controls['clinic'].setValidators([Validators.required]);
    this.childRecordForm.controls['involvementstatus'].setValidators([Validators.required]);

    for (const controlName in this.childRecordForm.controls) {
      const control = this.childRecordForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldChildRecord != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentChildRecord[controlName]) {
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
    this.enableButtons(true,false,false);
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }

  fillForm(child: ChildRecord) {
    this.enableButtons(false,true,true);

    this.currentChildRecord = child;
    this.oldChildRecord = this.currentChildRecord;

    this.childRecordForm.setValue({
      fullname: this.currentChildRecord.fullname,
      regno: this.currentChildRecord.regno,
      dobirth: this.currentChildRecord.dobirth,
      doregistered: this.currentChildRecord.doregistered,
      birthweight: this.currentChildRecord.birthweight,
      headperimeter: this.currentChildRecord.headperimeter,
      heightinbirth: this.currentChildRecord.heightinbirth,
      placeofbirth: this.currentChildRecord.placeofbirth,
      apgarscore: this.currentChildRecord.apgarscore,


      gender: this.currentChildRecord.gender?.id,
      clinic: this.currentChildRecord.clinic?.id,
      mother: this.currentChildRecord.mother?.id,
      bloodtype: this.currentChildRecord.bloodtype?.id,
      healthstatus: this.currentChildRecord.healthstatus?.id,
      involvementstatus: this.currentChildRecord.involvementstatus?.id
    });

    this.childRecordForm.markAsPristine();
  }

  filterClinic(event:any){
    let motherid = event.target.value;

    const mother = this.mothers.find(e=> e.id == parseInt(motherid));
    if(mother != undefined ){
      const clinicid = mother.clinic?.id;
      this.childRecordForm.controls['clinic'].setValue(clinicid);
    }
  }

  getUpdates():string {
    let updates: string = "";
    for (const controlName in this.childRecordForm.controls) {
      const control = this.childRecordForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  getErrors(){

    let errors:string = "";

    for(const controlName in this.childRecordForm.controls){
      const control = this.childRecordForm.controls[controlName];
      if(control.errors){
        if(this.regexes[controlName] != undefined){
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        }else{
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Child Record Add ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });
    }else{

      if(this.childRecordForm.valid){

        const childRecord:ChildRecord = {
          fullname: this.childRecordForm.controls['fullname'].value,
          regno: this.childRecordForm.controls['regno'].value,
          dobirth: this.childRecordForm.controls['dobirth'].value,
          doregistered: this.childRecordForm.controls['doregistered'].value,
          birthweight: this.childRecordForm.controls['birthweight'].value,
          headperimeter: this.childRecordForm.controls['headperimeter'].value,
          heightinbirth: this.childRecordForm.controls['heightinbirth'].value,
          placeofbirth: this.childRecordForm.controls['placeofbirth'].value,
          apgarscore: this.childRecordForm.controls['apgarscore'].value,

          gender: {id: parseInt(this.childRecordForm.controls['gender'].value)},
          clinic: {id: parseInt(this.childRecordForm.controls['clinic'].value)},
          mother: {id: parseInt(this.childRecordForm.controls['mother'].value)},
          bloodtype: {id: parseInt(this.childRecordForm.controls['bloodtype'].value)},
          healthstatus: {id: parseInt(this.childRecordForm.controls['healthstatus'].value)},
          involvementstatus: {id: parseInt(this.childRecordForm.controls['involvementstatus'].value)},
        }


        this.currentOperation = "Add Child Record " + childRecord.regno;

        this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
          .afterClosed().subscribe(res => {
          if(res) {
            this.cs.save(childRecord).subscribe({
              next:() => {
                this.tst.handleResult('success',"Child Record Saved Successfully");
                this.loadTable("");
                this.clearForm();
              },
              error:(err:any) => {
                this.tst.handleResult('failed',err.error.data.message);
              }
            });
          }
        });
      }
    }
  }

  update(currentChildRecord: ChildRecord) {
    let errors = this.getErrors();

    if(errors != ""){
      this.dialog.open(WarningDialogComponent,{
        data:{heading:"Errors - Child Record Update ",message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if(!res){
          return;
        }
      });

    }else{

      let updates:string = this.getUpdates();

      if(updates != ""){
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Child Record Update ",message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if(!res){
            return;
          }else{

            const childRecord:ChildRecord = {
              fullname: this.childRecordForm.controls['fullname'].value,
              regno: this.childRecordForm.controls['regno'].value,
              dobirth: this.childRecordForm.controls['dobirth'].value,
              doregistered: this.childRecordForm.controls['doregistered'].value,
              birthweight: this.childRecordForm.controls['birthweight'].value,
              headperimeter: this.childRecordForm.controls['headperimeter'].value,
              heightinbirth: this.childRecordForm.controls['heightinbirth'].value,
              placeofbirth: this.childRecordForm.controls['placeofbirth'].value,
              apgarscore: this.childRecordForm.controls['apgarscore'].value,

              gender: {id: parseInt(this.childRecordForm.controls['gender'].value)},
              clinic: {id: parseInt(this.childRecordForm.controls['clinic'].value)},
              mother: {id: parseInt(this.childRecordForm.controls['mother'].value)},
              bloodtype: {id: parseInt(this.childRecordForm.controls['bloodtype'].value)},
              healthstatus: {id: parseInt(this.childRecordForm.controls['healthstatus'].value)},
              involvementstatus: {id: parseInt(this.childRecordForm.controls['involvementstatus'].value)},
            }

            childRecord.id = currentChildRecord.id;

            this.currentOperation = "Update Child Record " + currentChildRecord.regno;

            this.dialog.open(ConfirmDialogComponent,{data:this.currentOperation})
              .afterClosed().subscribe(res => {
              if(res) {
                this.cs.update(childRecord).subscribe({
                  next:() => {
                    this.tst.handleResult('success',"Child Record Updated Successfully");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error:(err:any) => {
                    this.tst.handleResult('failed',err.error.data.message);
                  }
                });
              }
            })
          }
        });

      }else{
        this.dialog.open(WarningDialogComponent,{
          data:{heading:"Updates - Child Record Update ",message: "No Fields Updated "}
        }).afterClosed().subscribe(res =>{
          if(res){return;}
        })
      }
    }
  }

  delete(currentChildRecord: ChildRecord) {
    const operation = "Delete Child Record " + currentChildRecord.regno;

    this.dialog.open(ConfirmDialogComponent,{data:operation})
      .afterClosed().subscribe((res:boolean) => {
      if(res){
        if (currentChildRecord.id) {
          this.cs.delete(currentChildRecord.id).subscribe({
            next: () => {
              this.loadTable("");
              this.tst.handleResult('success',"Child Record Deleted Successfully");
              this.clearForm();
            },
            error: (err:any) => {
              this.tst.handleResult('failed',err.error.data.message);
              console.log(err);
            },
          });
        }
      }
    });
  }

  handleSearch() {
    const ssfullname  = this.childRecordSearchForm.controls['ssfullname'].value;
    const ssregno  = this.childRecordSearchForm.controls['ssregno'].value;
    const sshealthstatus  = this.childRecordSearchForm.controls['sshealthstatus'].value;
    const ssgender  = this.childRecordSearchForm.controls['ssgender'].value;
    const ssclinic  = this.childRecordSearchForm.controls['ssclinic'].value;

    let query = ""

    if(ssfullname != null && ssfullname.trim() !="") query = query + "&fullname=" + ssfullname;
    if(ssregno != null && ssregno.trim() !="") query = query + "&regno=" + ssregno;
    if(sshealthstatus != '') query = query + "&healthstatusid=" + parseInt(sshealthstatus);
    if(ssgender != '') query = query + "&genderid=" + parseInt(ssgender);
    if(ssclinic != '') query = query + "&clinicid=" + parseInt(ssclinic);

    if(query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    this.dialog.open(ConfirmDialogComponent,{data:"Clear Search"}
    ).afterClosed().subscribe(res => {
      if(!res){
        return;
      }else{
        this.childRecordSearchForm.reset();
        this.childRecordSearchForm.controls['ssgender'].setValue('');
        this.childRecordSearchForm.controls['ssclinic'].setValue('');
        this.childRecordSearchForm.controls['sshealthstatus'].setValue('');
        this.loadTable("");
      }
    });
  }

  clearForm() {
    this.childRecordForm.reset();
    this.childRecordForm.controls['gender'].setValue(null);
    this.childRecordForm.controls['mother'].setValue(null);
    this.childRecordForm.controls['bloodtype'].setValue(null);
    this.childRecordForm.controls['healthstatus'].setValue(null);
    this.childRecordForm.controls['involvementstatus'].setValue(null);
    this.childRecordForm.controls['doregistered'].setValue(this.datetoday);

    this.enableButtons(true,false,false);
  }
}
