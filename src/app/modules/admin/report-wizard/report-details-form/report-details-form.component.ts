import { Component, EventEmitter, Output } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { ReportDetailsForm } from '../../../../core/models/report-wizard.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { GlobalCodeService } from '../../../../core/services/global-code.service';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { UserService } from '../../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-report-details-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './report-details-form.component.html',
  styleUrl: './report-details-form.component.scss',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReportDetailsFormComponent {
  @Output() onReportSave = new EventEmitter<ReportDetailsForm>();
  @Output() onFilterChange = new EventEmitter<ReportDetailsForm>();

  // Syscraft comment
  // userId: number;
  userId!: number;
  companies: any = [];
  engineers: any = [];
  detailsForm: ReportDetailsForm = {
    companyId: 0,
    userId: 0,

    // Syscraft comment
    // reportDate: null,
    reportDate: null as any,
    crdId: 0,
    // Syscraft comment
    // collectedBy: null,
    // reportTitle: null
    collectedBy: "",
    reportTitle: ""
  };


  constructor(
    private globalCodeService: GlobalCodeService, 
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    this.detailsForm = {
      // Syscraft comment
      // reportDate: null,
      reportDate: null as any,
      userId: 0,
      companyId: 0,
      crdId: 0,

      // Syscraft comment
      // collectedBy: null,
      // reportTitle: null
      collectedBy: "",
      reportTitle: ""
    }

    this.getUserByAccount();
    this.getCustomerName();

      this.route.queryParams.subscribe((params: any) => {
        if(params){
          if(this.detailsForm.companyId == 0 && this.detailsForm.userId == 0 && this.detailsForm.crdId == 0 && this.detailsForm.reportDate == null){
            this.detailsForm.companyId = params.companyId;
            this.detailsForm.reportDate = params.reportDate;
            this.detailsForm.userId = params.userId;
            this.detailsForm.crdId = params.crdId;
            this.detailsForm.collectedBy = params.collectedBy;
            this.detailsForm.reportTitle =params.reportTitle
          }
        }
        
    })
  }

  
  getCustomerName(){
    const user = this.localStorageService.getUserCredentials();
    this.userId = user.userId;
    this.globalCodeService.getAssignedCompany({userId: this.userId}).subscribe(res => {
      this.companies = res.assignedUserCompanies;
    })   
  }

  getUserByAccount(){
    this.userService.getUserByAccountType({accountTypeName:"Admin", page:0, limit:0, orderBy:"CreatedOn", orderByDescending:true, allRecords:true}).subscribe(res => {
      this.engineers = res.userResponsesList;
      this.engineers = this.globalCodeService.sortByAlphabetical(this.engineers,'contactName');
    }, error => {
    })
  }

  saveCompanyReportDetails() {
    this.onReportSave.emit(this.detailsForm);
  }

  filterChanged(){
    const index = this.companies.findIndex((x: any) => x.companyId == this.detailsForm.companyId);
    if(index > -1){
      this.detailsForm.companyName = this.companies[index].companyName;
    }
    this.onFilterChange.emit(this.detailsForm);
  }

  // Syscraft comment
  // isInvalidField(reportDetailsForm: NgForm, inputControl: NgModel): boolean {

  isInvalidField(reportDetailsForm: NgForm, inputControl: NgModel) {
    return (reportDetailsForm.submitted || inputControl.touched) && inputControl.invalid;
  }

}
