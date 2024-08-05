import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Vaccination} from "../../core/entity/vaccination";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {Clinic} from "../../core/entity/clinic";
import {ChildRecord} from "../../core/entity/childrecord";
import {VaccineOffering} from "../../core/entity/vaccineoffering";
import {VaccinationStatus} from "../../core/entity/vaccinationstatus";
import {VaccinationProgress} from "../../core/entity/vaccinationprogress";
import {ToastService} from "../../core/util/toast/toast.service";
import {MatDialog} from "@angular/material/dialog";
import {VaccinationService} from "../../core/service/vaccination/vaccination.service";
import {VaccinationstatusService} from "../../core/service/vaccination/vaccinationstatus.service";
import {VaccinationprogressService} from "../../core/service/vaccination/vaccinationprogress.service";
import {VaccineofferingService} from "../../core/service/vaccine/vaccineoffering.service";
import {ClinicService} from "../../core/service/clinic/clinic.service";
import {ChildrecordService} from "../../core/service/childrecords/childrecord.service";
import {RouterLink} from "@angular/router";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {AsyncPipe} from "@angular/common";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {VaccinationRecord} from "../../core/entity/vaccinationrecord";
import {RegexService} from "../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-vaccination',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatGridList,
    MatGridTile,
    AsyncPipe,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent
  ],
  templateUrl: './vaccination.component.html',
  styleUrl: './vaccination.component.scss'
})
export class VaccinationComponent implements OnInit {

  vaccinationForm!: FormGroup;
  vaccinationSearchForm!: FormGroup;
  innerForm!: FormGroup;

  oldVaccination!: Vaccination;
  currentVaccination!: Vaccination;

  inndata!: any;
  oldInndata!: any;

  isLoading = false;
  isFailed = false;

  currentOperation = '';

  dataSource!: MatTableDataSource<Vaccination>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  hasUpdateAuthority = this.am.hasAuthority("Vaccination-Update");
  hasDeleteAuthority = this.am.hasAuthority("Vaccination-Delete");
  hasWriteAuthority = this.am.hasAuthority("Vaccination-Write");
  hasReadAuthority = this.am.hasAuthority("Vaccination-Read");

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  regexes: any;

  clinics: Clinic[] = [];
  childs: ChildRecord[] = [];
  vofferings: VaccineOffering[] = [];
  vaccinations: Vaccination[] = [];
  vaccinationstatuses: VaccinationStatus[] = [];
  vaccinationprogresses: VaccinationProgress[] = [];
  innerdata: VaccinationRecord[] = [];

  isInnerDataUpdated: boolean = false;

  constructor(
    private am: AuthorizationService,
    private fb: FormBuilder,
    private tst: ToastService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private vs: VaccinationService,
    private vss: VaccinationstatusService,
    private vps: VaccinationprogressService,
    private vos: VaccineofferingService,
    private cs: ClinicService,
    private crs: ChildrecordService,
    private rs: RegexService
  ) {

    this.vaccinationSearchForm = this.fb.group({
      "sschildrecords": new FormControl(''),
      "ssvaccineoffering": new FormControl(''),
      "ssvaccinationprogress": new FormControl(''),
      "ssclinic": new FormControl(''),
    }, {updateOn: "change"});

    this.vaccinationForm = this.fb.group({
      "clinic": new FormControl(null, [Validators.required]),
      "childrecords": new FormControl(null, [Validators.required]),
      "lastupdated": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "vaccinationprogress": new FormControl(null, [Validators.required]),
    }, {updateOn: "change"});

    this.innerForm = this.fb.group({
      "date": new FormControl(''),
      "vaccineoffering": new FormControl(null),
      "vaccinationstatus": new FormControl(null),
    }, {updateOn: "change"});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.loadTable("");

    this.cs.getAllList().subscribe({
      next: data => {
        this.clinics = data;
        // @ts-ignore
        this.clinics.sort((a, b) => a.divisionname.localeCompare(b.divisionname));
      }
    });

    this.crs.getAll("").subscribe({
      next: data => {
        this.childs = data;
        // @ts-ignore
        this.childs.sort((a, b) => a.fullname.localeCompare(b.fullname));
      }
    });

    this.vps.getAll().subscribe({
      next: data => this.vaccinationprogresses = data,
    });

    this.vss.getAll().subscribe({
      next: data => this.vaccinationstatuses = data,
    });

    this.vos.getAll().subscribe({
      next: data => {
        this.vofferings = data;
        // @ts-ignore
        this.vofferings.sort((a, b) => a.title.localeCompare(b.title));
      },
    });

    this.rs.getRegexes('vaccination').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });
  }

  loadTable(query: string) {
    this.vs.getAll(query).subscribe({
      next: data => {
        this.vaccinations = data;
        this.dataSource = new MatTableDataSource(this.vaccinations);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    });
  }

  createForm() {
    this.vaccinationForm.controls['clinic'].setValidators([Validators.required]);
    this.vaccinationForm.controls['childrecords'].setValidators([Validators.required]);
    this.vaccinationForm.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.vaccinationForm.controls['vaccinationprogress'].setValidators([Validators.required]);
    this.vaccinationForm.controls['lastupdated'].setValidators([Validators.required]);

    this.innerForm.controls['vaccineoffering'].setValidators([Validators.required]);
    this.innerForm.controls['vaccinationstatus'].setValidators([Validators.required]);
    this.innerForm.controls['date'].setValidators([Validators.required]);

    Object.values(this.vaccinationForm.controls).forEach(control => {
      control.markAsTouched();
    });
    Object.values(this.innerForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.vaccinationForm.controls) {
      const control = this.vaccinationForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldVaccination != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentVaccination[controlName]) {
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

    for (const controlName in this.innerForm.controls) {
      const control = this.innerForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldInndata != undefined && control.valid) {
            // @ts-ignore
            if (value === this.innerForm[controlName]) {
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

  fillForm(vaccination: Vaccination) {
    this.enableButtons(false, true, true);

    this.currentVaccination = vaccination;
    this.oldVaccination = this.currentVaccination;

    this.innerdata = this.currentVaccination.vaccinationrecords;


    this.vaccinationForm.patchValue({
      lastupdated: this.currentVaccination.lastupdated,
      clinic: this.currentVaccination.clinic?.id,
      childrecords: this.currentVaccination.childrecords?.id,
      vaccinationprogress: this.currentVaccination.vaccinationprogress?.id,
      description: this.currentVaccination.description,
    })

    //this.porderForm.patchValue(this.productOrder);

    this.vaccinationForm.markAsPristine();

    for (const controlName in this.innerForm.controls) {
      this.innerForm.controls[controlName].clearValidators();
      this.innerForm.controls[controlName].updateValueAndValidity();
    }
  }

  id = 0;

  addToTable() {

    this.inndata = this.innerForm.getRawValue();

    if (this.inndata.vaccineoffering == null || this.inndata.vaccinationstatus == null || this.inndata.date == "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Vaccination Record Add ", message: "Please Add Required Details"}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      // Create the new vaccination record
      let vac = new VaccinationRecord(this.id, this.inndata.vaccineoffering, this.inndata.date, this.inndata.vaccinationstatus);

      // Create a temporary array to hold the existing records
      let tem: VaccinationRecord[] = [];
      if (this.innerdata != null) this.innerdata.forEach((i) => tem.push(i));

      // Clear the original array
      this.innerdata = [];

      // Add the existing records back to the original array
      tem.forEach((t) => this.innerdata.push(t));

      // Check if the new record already exists in the array
      let exists = this.innerdata.some(record => record.vaccineoffering?.id === vac.vaccineoffering?.id);

      if (!exists) {
        // If it does not exist, add the new record
        this.innerdata.push(vac);
      } else {
        // If it exists, you can handle it as needed, e.g., show a message
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Errors - Vaccination Record Add ", message: "Duplicate record. This record already exists in the table."}
        }).afterClosed().subscribe(res => {
          if (!res) {
            return;
          }
        });
      }

      this.id++;

      this.isInnerDataUpdated = true;
      this.innerForm.reset();

      for (const controlName in this.innerForm.controls) {
        this.innerForm.controls[controlName].clearValidators();
        this.innerForm.controls[controlName].updateValueAndValidity();
      }
    }

  }

  deleteRow(indata: VaccinationRecord) {
    let datasources = this.innerdata;

    this.dialog.open(ConfirmDialogComponent, {data: "Vaccination Records"})
      .afterClosed().subscribe(res => {
      if (res) {

        const index = datasources.findIndex(item => item.id === indata.id);

        if (index > -1) {
          datasources.splice(index, 1);
        }

        this.innerdata = datasources;
        this.isInnerDataUpdated = true;
      }
    });
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.vaccinationForm.controls) {
      const control = this.vaccinationForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    if (this.isInnerDataUpdated) {
      updates = updates + "<br>" + "Vaccination Record Changed";
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.vaccinationForm.controls) {
      const control = this.vaccinationForm.controls[controlName];
      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    if (this.innerdata.length == 0) {
      errors = errors + "<br>Invalid Vaccination Record";
    }
    return errors;
  }

  add() {
    let errors = this.getErrors();
    //console.log(this.innerdata);

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Vaccination Add ", message: "You Have Following Errors " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.vaccinationForm.valid) {

        // @ts-ignore
        this.innerdata.forEach((i) => delete i.id);


        const vaccination: Vaccination = {
          lastupdated: this.vaccinationForm.controls['lastupdated'].value,
          description: this.vaccinationForm.controls['description'].value,

          vaccinationrecords: this.innerdata,

          clinic: {id: parseInt(this.vaccinationForm.controls['clinic'].value)},
          vaccinationprogress: {id: parseInt(this.vaccinationForm.controls['vaccinationprogress'].value)},
          childrecords: {id: parseInt(this.vaccinationForm.controls['childrecords'].value), dobirth: ''},
        }

        //console.log(porder);
        this.currentOperation = "Add Distribution ";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.vs.save(vaccination).subscribe({
              next: () => {
                this.tst.handleResult('success', "Vaccination Saved Successfully");
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

    }
  }

  update(currentVaccination: Vaccination) {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - Vaccination Update ", message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - Vaccination Update ", message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if (!res) {
            return;
          } else {

            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);

            const vaccination: Vaccination = {
              lastupdated: this.vaccinationForm.controls['lastupdated'].value,
              description: this.vaccinationForm.controls['description'].value,

              vaccinationrecords: this.innerdata,

              clinic: {id: parseInt(this.vaccinationForm.controls['clinic'].value)},
              vaccinationprogress: {id: parseInt(this.vaccinationForm.controls['vaccinationprogress'].value)},
              childrecords: {id: parseInt(this.vaccinationForm.controls['childrecords'].value), dobirth: ''},
            }

            vaccination.id = currentVaccination.id;

            //console.log(distribution);

            this.currentOperation = "Vaccination Update ";

            this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
              .afterClosed().subscribe(res => {
              if (res) {
                this.vs.update(vaccination).subscribe({
                  next: () => {
                    this.tst.handleResult('success', "Vaccination Successfully Updated");
                    this.loadTable("");
                    this.clearForm();
                  },
                  error: (err: any) => {
                    this.tst.handleResult('Failed', err.error.data.message);
                    //console.log(err);
                  }
                });
              }
            })

          }
        });

      } else {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - Vaccination Update ", message: "No Fields Updated "}
        }).afterClosed().subscribe(res => {
          if (res) {
            return;
          }
        })
      }
    }
  }

  delete(currentVaccination: Vaccination) {

    const operation = "Delete Vaccination ";
    //console.log(operation);

    this.dialog.open(ConfirmDialogComponent, {data: operation})
      .afterClosed().subscribe((res: boolean) => {
      if (res && currentVaccination.id) {
        this.vs.delete(currentVaccination.id).subscribe({
          next: () => {
            this.loadTable("");
            this.tst.handleResult("success", "Vaccination Successfully Deleted");
            this.clearForm();
          },

          error: (err: any) => {
            this.tst.handleResult("Failed", err.error.data.message);
          }
        });
      }
    });

  }

  clearForm() {
    this.vaccinationForm.reset();
    this.vaccinationForm.controls['clinic'].setValue(null);
    this.vaccinationForm.controls['childrecords'].setValue(null);
    this.vaccinationForm.controls['vaccinationprogress'].setValue(null);
    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true, false, false);
  }

  handleSearch() {
    const ssclinic = this.vaccinationSearchForm.controls['ssclinic'].value;
    const ssvaccinationprogress = this.vaccinationSearchForm.controls['ssvaccinationprogress'].value;
    const sschildrecords = this.vaccinationSearchForm.controls['sschildrecords'].value;
    const ssvaccineoffering = this.vaccinationSearchForm.controls['ssvaccineoffering'].value;

    let query = ""

    if (ssclinic != "") query = query + "&clinicid=" + parseInt(ssclinic);
    if (ssvaccinationprogress != "") query = query + "&vaccinationprogressid=" + parseInt(ssvaccinationprogress);
    if (sschildrecords != "") query = query + "&childrecordid=" + parseInt(sschildrecords);
    if (ssvaccineoffering != "") query = query + "&vaccineofferingid=" + parseInt(ssvaccineoffering);

    if (query != "") query = query.replace(/^./, "?")
    this.loadTable(query);
  }

  clearSearch() {
    const operation = "Clear Search";

    this.dialog.open(ConfirmDialogComponent, {data: operation})
      .afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.vaccinationSearchForm.controls['ssclinic'].setValue('');
        this.vaccinationSearchForm.controls['ssvaccinationprogress'].setValue('');
        this.vaccinationSearchForm.controls['sschildrecords'].setValue('');
        this.vaccinationSearchForm.controls['ssvaccineoffering'].setValue('');
        this.loadTable("");
      }
    });
  }


}
