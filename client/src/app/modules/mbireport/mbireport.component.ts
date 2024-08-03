import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {Moh} from "../../core/entity/moh";
import {Rdh} from "../../core/entity/rdh";
import {Employee} from "../../core/entity/employee";
import {ReviewStatus} from "../../core/entity/reviewstatus";
import {ReportCategory} from "../../core/entity/reportcategory";
import {MbiReport} from "../../core/entity/mbireport";
import {AuthorizationService} from "../../core/service/auth/authorization.service";
import {MatTableDataSource} from "@angular/material/table";
import {Observable} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {AsyncPipe} from "@angular/common";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import {PageErrorComponent} from "../../shared/page-error/page-error.component";
import {PageLoadingComponent} from "../../shared/page-loading/page-loading.component";
import {MbireportService} from "../../core/service/mbireport/mbireport.service";
import {EmployeeService} from "../../core/service/employee/employee.service";
import {MohService} from "../../core/service/moh/moh.service";
import {RdhService} from "../../core/service/moh/rdh.service";
import {ReviewstatusService} from "../../core/service/mbireport/reviewstatus.service";
import {ReportcategoryService} from "../../core/service/mbireport/reportcategory.service";
import {ToastService} from "../../core/util/toast/toast.service";
import {RegexService} from "../../core/service/regexes/regex.service";
import {WarningDialogComponent} from "../../shared/dialog/warning-dialog/warning-dialog.component";
import {ConfirmDialogComponent} from "../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-mbireport',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    AsyncPipe,
    MatGridTile,
    MatPaginator,
    PageErrorComponent,
    PageLoadingComponent,
    MatGridList
  ],
  templateUrl: './mbireport.component.html',
  styleUrl: './mbireport.component.scss'
})
export class MbireportComponent implements OnInit {

  ReportForm: FormGroup;
  reportSearchForm: FormGroup;

  isFailed = false;
  isLoading = false;

  mohs: Moh[] = [];
  rdhs: Rdh[] = [];
  employees: Employee[] = [];
  reviewstatuses: ReviewStatus[] = [];
  reportcategories: ReportCategory[] = [];
  reports: MbiReport[] = [];

  oldReport!: MbiReport;
  currentReport!: MbiReport;

  isUpdate = false;
  isSubmit = true;

  currentOperation = '';

  regexes: any;

  protected hasUpdateAuthority = this.authorizationService.hasAuthority("Employee-Update"); //need to be false
  protected hasDeleteAuthority = this.authorizationService.hasAuthority("Employee-Delete"); //need to be false
  protected hasWriteAuthority = this.authorizationService.hasAuthority("Employee-Write"); //need to be false
  protected hasReadAuthority = this.authorizationService.hasAuthority("Employee-Read"); //need to be false

  dataSource!: MatTableDataSource<MbiReport>;
  data!: Observable<any>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authorizationService: AuthorizationService,
    private rs: MbireportService,
    private cdr: ChangeDetectorRef,
    private es: EmployeeService,
    private ms: MohService,
    private rds: RdhService,
    private rss: ReviewstatusService,
    private rcs: ReportcategoryService,
    private tst: ToastService,
    private rsx: RegexService,
    private dialog: MatDialog
  ) {
    this.ReportForm = this.fb.group({
      "code": new FormControl('', [Validators.required]),
      "date": new FormControl('', [Validators.required]),
      "moh": new FormControl(null, [Validators.required]),
      "rdh": new FormControl(null, [Validators.required]),
      "employee": new FormControl(null, [Validators.required]),
      "motherregcount": new FormControl('', [Validators.required]),
      "childregcount": new FormControl('', [Validators.required]),
      "totalregcount": new FormControl('', [Validators.required]),
      "childattendacecount": new FormControl('', [Validators.required]),
      "motherattendacecount": new FormControl('', [Validators.required]),
      "totalattendacecount": new FormControl('', [Validators.required]),
      "mdistributionscount": new FormControl('', [Validators.required]),
      "cdistributionscount": new FormControl('', [Validators.required]),
      "totaldistributionscount": new FormControl('', [Validators.required]),
      "issuedmpackets": new FormControl('', [Validators.required]),
      "issuedcpacketscount": new FormControl('', [Validators.required]),
      "totalissuedpacketscount": new FormControl('', [Validators.required]),
      "receivedpacketcount": new FormControl('', [Validators.required]),
      "distributedpacketcount": new FormControl('', [Validators.required]),
      "remainingpacketscount": new FormControl('', [Validators.required]),
      "reviewstatus": new FormControl(null, [Validators.required]),
      "reportcategory": new FormControl(null, [Validators.required]),
      "description": new FormControl('', [Validators.required]),

    }, {updateOn: "change"});

    this.reportSearchForm = this.fb.group({
      "sscode": new FormControl(''),
      "ssreviewstatus": new FormControl(''),
      "ssmoh": new FormControl(''),
    },{updateOn:"change"});
  }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.loadTable("");

    this.es.getAllEmployeesList("?designation=1").subscribe({
      next: data => this.employees = data,
    });

    this.ms.getAllMohsList().subscribe({
      next: data => this.mohs = data,
    });

    this.rds.getAllDistricts().subscribe({
      next: data => this.rdhs = data,
    });

    this.rss.getAll().subscribe({
      next: data => this.reviewstatuses = data,
    });

    this.rcs.getAll().subscribe({
      next: data => this.reportcategories = data,
    });

    this.rsx.getRegexes('mbireport').subscribe({
      next: data => {
        this.regexes = data;
        this.createForm();
      },
      error: () => this.regexes = [] || undefined
    });

    this.ReportForm.controls['reviewstatus'].disable();
    this.ReportForm.controls['reviewstatus'].setValue(1);
  }

  loadTable(query: string) {
    this.rs.getAll(query).subscribe({
      next: data => {
        this.reports = data;
        this.dataSource = new MatTableDataSource<MbiReport>(this.reports);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.data = this.dataSource.connect();
      }
    })
  }

  createForm() {
    this.ReportForm.controls['date'].setValidators([Validators.required]);
    this.ReportForm.controls['code'].setValidators([Validators.required, Validators.pattern(this.regexes['code']['regex'])]);
    this.ReportForm.controls['moh'].setValidators([Validators.required]);
    this.ReportForm.controls['rdh'].setValidators([Validators.required]);
    this.ReportForm.controls['employee'].setValidators([Validators.required]);
    this.ReportForm.controls['motherregcount'].setValidators([Validators.required, Validators.pattern(this.regexes['motherregcount']['regex'])]);
    this.ReportForm.controls['childregcount'].setValidators([Validators.required, Validators.pattern(this.regexes['childregcount']['regex'])]);
    this.ReportForm.controls['totalregcount'].setValidators([Validators.required, Validators.pattern(this.regexes['totalregcount']['regex'])]);
    this.ReportForm.controls['childattendacecount'].setValidators([Validators.required, Validators.pattern(this.regexes['childattendacecount']['regex'])]);
    this.ReportForm.controls['motherattendacecount'].setValidators([Validators.required, Validators.pattern(this.regexes['motherattendacecount']['regex'])]);
    this.ReportForm.controls['totalattendacecount'].setValidators([Validators.required, Validators.pattern(this.regexes['totalattendacecount']['regex'])]);
    this.ReportForm.controls['mdistributionscount'].setValidators([Validators.required, Validators.pattern(this.regexes['mdistributionscount']['regex'])]);
    this.ReportForm.controls['cdistributionscount'].setValidators([Validators.required, Validators.pattern(this.regexes['cdistributionscount']['regex'])]);
    this.ReportForm.controls['totaldistributionscount'].setValidators([Validators.required, Validators.pattern(this.regexes['totaldistributionscount']['regex'])]);
    this.ReportForm.controls['issuedmpackets'].setValidators([Validators.required, Validators.pattern(this.regexes['issuedmpackets']['regex'])]);
    this.ReportForm.controls['issuedcpacketscount'].setValidators([Validators.required, Validators.pattern(this.regexes['issuedcpacketscount']['regex'])]);
    this.ReportForm.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);
    this.ReportForm.controls['distributedpacketcount'].setValidators([Validators.required, Validators.pattern(this.regexes['distributedpacketcount']['regex'])]);
    this.ReportForm.controls['remainingpacketscount'].setValidators([Validators.required, Validators.pattern(this.regexes['remainingpacketscount']['regex'])]);
    this.ReportForm.controls['receivedpacketcount'].setValidators([Validators.required, Validators.pattern(this.regexes['receivedpacketcount']['regex'])]);
    this.ReportForm.controls['totalissuedpacketscount'].setValidators([Validators.required, Validators.pattern(this.regexes['totalissuedpacketscount']['regex'])]);
    this.ReportForm.controls['reviewstatus'].setValidators([Validators.required]);
    this.ReportForm.controls['reportcategory'].setValidators([Validators.required]);

    Object.values(this.ReportForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.ReportForm.controls) {
      const control = this.ReportForm.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldReport != undefined && control.valid) {
            // @ts-ignore
            if (value === this.currentReport[controlName]) {
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

  fillForm(report: MbiReport) {

    this.enableButtons(false, true, true);

    this.currentReport = report;
    this.oldReport = this.currentReport;

    this.ReportForm.setValue({
      code: this.currentReport.code,
      date: this.currentReport.date,
      moh: this.currentReport.moh?.id,
      rdh: this.currentReport.moh?.rdh?.id,
      employee: this.currentReport.employee?.id,
      motherregcount: this.currentReport.motherregcount,
      childregcount: this.currentReport.childregcount,
      totalregcount: this.currentReport.totalregcount,
      childattendacecount: this.currentReport.childattendacecount,
      motherattendacecount: this.currentReport.motherattendacecount,
      totalattendacecount: this.currentReport.totalattendacecount,
      mdistributionscount: this.currentReport.mdistributionscount,
      cdistributionscount: this.currentReport.cdistributionscount,
      totaldistributionscount: this.currentReport.totaldistributionscount,
      issuedmpackets: this.currentReport.issuedmpackets,
      issuedcpacketscount: this.currentReport.issuedcpacketscount,
      totalissuedpacketscount: this.currentReport.totalissuedpacketscount,
      receivedpacketcount: this.currentReport.receivedpacketcount,
      distributedpacketcount: this.currentReport.distributedpacketcount,
      remainingpacketscount: this.currentReport.remainingpacketscount,
      reviewstatus: this.currentReport.reviewstatus?.id,
      reportcategory: this.currentReport.reportcategory?.id,
      description: this.currentReport.description,

    });

    this.ReportForm.disable();
    this.ReportForm.controls['reviewstatus'].enable();

    this.isUpdate = true;
    this.isSubmit = false;

    this.ReportForm.markAsPristine();

  }

  getRegTotal() {
    this.getTotal("motherregcount", "childregcount", "totalregcount")
  }

  getAttendanceTotal() {
    this.getTotal("motherattendacecount", "childattendacecount", "totalattendacecount")
  }

  getDistributionTotal() {
    this.getTotal("mdistributionscount", "cdistributionscount", "totaldistributionscount")
  }

  getIssuedPacketTotal() {
    this.getTotal("issuedmpackets", "issuedcpacketscount", "totalissuedpacketscount")
  }

  getMohDetails(event: any) {
    let mohid = event.target.value;

    this.ms.getMohById(parseInt(mohid)).subscribe({
      next: data => {
        let rdhid = data.rdh?.id;
        let employeeid = data.employee?.id;
        this.ReportForm.controls['rdh'].setValue(rdhid);
        this.ReportForm.controls['employee'].setValue(employeeid);
      }
    });
  }

  getTotal(value1control: string, value2control: string, totalvaluecontrol: string) {

    let m: number = 0;
    let c: number = 0;

    const motherValue = parseInt(this.ReportForm.controls[`${value1control}`].value);
    if (isNaN(motherValue)) {
      m = 0;
    } else {
      m = motherValue;
    }

    const childValue = parseInt(this.ReportForm.controls[`${value2control}`].value);
    if (isNaN(childValue)) {
      c = 0;
    } else {
      c = childValue;
    }

    let total: number = m + c;
    this.ReportForm.controls[`${totalvaluecontrol}`].setValue(total);
  }

  getUpdates(): string {
    let updates: string = "";
    for (const controlName in this.ReportForm.controls) {
      const control = this.ReportForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  getErrors() {

    let errors: string = "";

    for (const controlName in this.ReportForm.controls) {
      const control = this.ReportForm.controls[controlName];
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
        data: {heading: "Errors - MBI Report Add ", message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });
    } else {

      if (this.ReportForm.valid) {

        const report: MbiReport = {
          code: this.ReportForm.controls['code'].value,
          date: this.ReportForm.controls['date'].value,
          motherregcount: this.ReportForm.controls['motherregcount'].value,
          childregcount: this.ReportForm.controls['childregcount'].value,
          totalregcount: this.ReportForm.controls['totalregcount'].value,
          childattendacecount: this.ReportForm.controls['childattendacecount'].value,
          motherattendacecount: this.ReportForm.controls['motherattendacecount'].value,
          totalattendacecount: this.ReportForm.controls['totalattendacecount'].value,
          mdistributionscount: this.ReportForm.controls['mdistributionscount'].value,
          cdistributionscount: this.ReportForm.controls['cdistributionscount'].value,
          totaldistributionscount: this.ReportForm.controls['totaldistributionscount'].value,
          issuedmpackets: this.ReportForm.controls['issuedmpackets'].value,
          issuedcpacketscount: this.ReportForm.controls['issuedcpacketscount'].value,
          totalissuedpacketscount: this.ReportForm.controls['totalissuedpacketscount'].value,
          receivedpacketcount: this.ReportForm.controls['receivedpacketcount'].value,
          distributedpacketcount: this.ReportForm.controls['distributedpacketcount'].value,
          remainingpacketscount: this.ReportForm.controls['remainingpacketscount'].value,
          description: this.ReportForm.controls['description'].value,

          moh: {id: parseInt(this.ReportForm.controls['moh'].value)},
          rdh: {id: parseInt(this.ReportForm.controls['rdh'].value)},
          employee: {id: parseInt(this.ReportForm.controls['employee'].value)},
          reviewstatus: {id: parseInt(this.ReportForm.controls['reviewstatus'].value)},
          reportcategory: {id: parseInt(this.ReportForm.controls['reportcategory'].value)},

        }

        console.log(report);

        this.currentOperation = "Add Report ";

        this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
          .afterClosed().subscribe(res => {
          if (res) {
            this.rs.save(report).subscribe({
              next: () => {
                this.tst.handleResult('success', "Report Saved Successfully");
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


  update(currentReport: MbiReport) {
    let errors = this.getErrors();

    if (errors != "") {
      this.dialog.open(WarningDialogComponent, {
        data: {heading: "Errors - MBI Report Update ", message: "You Have Following Errors <br> " + errors}
      }).afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - MBI Report Update ", message: "You Have Following Updates <br> " + updates}
        }).afterClosed().subscribe(res => {
          if (!res) {
            return;
          } else {

            if (this.ReportForm.valid) {

              const report: MbiReport = {
                code: this.ReportForm.controls['code'].value,
                date: this.ReportForm.controls['date'].value,
                motherregcount: this.ReportForm.controls['motherregcount'].value,
                childregcount: this.ReportForm.controls['childregcount'].value,
                totalregcount: this.ReportForm.controls['totalregcount'].value,
                childattendacecount: this.ReportForm.controls['childattendacecount'].value,
                motherattendacecount: this.ReportForm.controls['motherattendacecount'].value,
                totalattendacecount: this.ReportForm.controls['totalattendacecount'].value,
                mdistributionscount: this.ReportForm.controls['mdistributionscount'].value,
                cdistributionscount: this.ReportForm.controls['cdistributionscount'].value,
                totaldistributionscount: this.ReportForm.controls['totaldistributionscount'].value,
                issuedmpackets: this.ReportForm.controls['issuedmpackets'].value,
                issuedcpacketscount: this.ReportForm.controls['issuedcpacketscount'].value,
                totalissuedpacketscount: this.ReportForm.controls['totalissuedpacketscount'].value,
                receivedpacketcount: this.ReportForm.controls['receivedpacketcount'].value,
                distributedpacketcount: this.ReportForm.controls['distributedpacketcount'].value,
                remainingpacketscount: this.ReportForm.controls['remainingpacketscount'].value,
                description: this.ReportForm.controls['description'].value,

                moh: {id: parseInt(this.ReportForm.controls['moh'].value)},
                rdh: {id: parseInt(this.ReportForm.controls['rdh'].value)},
                employee: {id: parseInt(this.ReportForm.controls['employee'].value)},
                reviewstatus: {id: parseInt(this.ReportForm.controls['reviewstatus'].value)},
                reportcategory: {id: parseInt(this.ReportForm.controls['reportcategory'].value)},

              }

              report.id = currentReport.id;

              console.log(report);

              this.currentOperation = "Update MOH ";

              this.dialog.open(ConfirmDialogComponent, {data: this.currentOperation})
                .afterClosed().subscribe(res => {
                if (res) {
                  this.rs.update(report).subscribe({
                    next: () => {
                      this.tst.handleResult('success', "MBI Report Updated Successfully");
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
        });

      } else {
        this.dialog.open(WarningDialogComponent, {
          data: {heading: "Updates - MBI Report Update ", message: "No Fields Updated "}
        }).afterClosed().subscribe(res => {
          if (res) {
            return;
          }
        })
      }
    }
  }

  clearForm() {
    this.ReportForm.reset();
    this.ReportForm.controls['employee'].setValue(null);
    this.ReportForm.controls['moh'].setValue(null);
    this.ReportForm.controls['rdh'].setValue(null);
    this.ReportForm.controls['reviewstatus'].setValue(null);
    this.ReportForm.controls['reportcategory'].setValue(null);

    this.ReportForm.enable();
    this.ReportForm.controls['reviewstatus'].disable();
    this.ReportForm.controls['reviewstatus'].setValue(1);

    this.isUpdate = false;
    this.isSubmit = true;
  }

  handleSearch() {

  }

  clearSearch() {

  }
}
