import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import moment from 'moment';
import { BaseUrl } from '../../../config/url-config';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import { ReportWizardService } from '../../../core/services/report-wizard.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { FullCmReportDetailComponent } from '../full-cm-report-detail/full-cm-report-detail.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
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

export interface PdfDetails{
  companyReportDetailId: number,
  reportDate: string,
  reportTitle: string,
  fileInBase64: string,
  fileType: string,
  actionBy? : string,
  companyId: number
}

@Component({
  selector: 'app-full-cm-report-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    NgxSpinnerModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatDatepickerModule, 
    FullCmReportDetailComponent
  ],
  templateUrl: './full-cm-report-list.component.html',
  styleUrl: './full-cm-report-list.component.scss',
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class FullCmReportListComponent {
  api = BaseUrl.apiUrl;
  fullCmReportList: any;

  // Syscraft comment
  // msgInputTxt : '';

  msgInputTxt! : '';
  msgList = [];
  userId: any;
  assignedCompany:any;

  // Syscraft comment
  // assign: boolean;
  // noAssign: boolean;

  assign!: boolean;
  noAssign!: boolean;
  notFound: boolean = true;

  // Syscraft comment
  // companyId: number;
  companyId!: number;
  companyName: any;
  companyReportDetailList: any;
  intValue: number = 1;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    // navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 3,
      },
      768: {
        items: 3,
      },
      1024: {
        items: 4,
      },
      1280: {
        items: 4,
      },

    },
    nav: true
  }

  pdfDetails : PdfDetails = {
    companyReportDetailId: 0,

    // Syscraft comment
    // reportDate: null,
    // reportTitle: null,
    // fileInBase64: null,
    // fileType: null,
    reportDate: "",
    reportTitle: "",
    fileInBase64: "",
    fileType: "",
    companyId: 0
  }

  searchFilterSub: Subscription;
  reportListDataForFilter: any;
  constructor(
    private globalCodeService: GlobalCodeService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private userService: UserService,
    private reportWizardService: ReportWizardService,
    private route: ActivatedRoute,
    private globalService: GlobalCodeService
    ) {
      this.searchFilterSub = this.globalService.searchFilter$.subscribe(value => {
        this.searchFilter(value);
      })
     }

  // Syscraft comment
  // readingId: number;
  readingId!: number;
  accountType: any;

  // Syscraft comment
  // compName: string;
  compName!: string;
  ngOnInit(): void {
    const user = this.localStorageService.getUserCredentials();
    this.userId = user.userId;
    this.accountType = user.accountType.accountTypeName
    this.fullCmDropdown();
    this.getCompanyReportDetails();
    this.getUserByAccount();
    
    this.route.queryParams.subscribe((params: any) => {
      if(params){
        this.companyId = params.CompanyId;
      }
    });
    
    if(this.companyId == undefined || this.companyId == null){
      const compId = this.localStorageService.getCompanyId();
      if(compId.companyId == 0){
        this.companyId = 0;
      }else{
        this.companyId = compId.companyId;
        this.compName = compId.companyName;
        this.companyName = compId.companyName;
        
      }
    }
    
  }

  fullCmDropdown(){
    this.globalCodeService.getAssignedCompany({userId: this.userId}).subscribe(res => {
      this.assignedCompany = res.assignedUserCompanies;
      
      if(this.assignedCompany){
        // this.companyId=this.assignedCompany[0].companyId;
        if(this.companyId == 0){
          this.companyId=this.assignedCompany[0].companyId;
        }
        // this.companyName = this.assignedCompany[0].companyName;
        this.getCompanyReportDetails(); 
        this.assign = true;
        this.noAssign = false;
      }else{
        this.assign = false;
        this.noAssign = true;
      }
    }) 
  }

  getCompanyId(value: any){
    const index = this.assignedCompany.findIndex((x: any)=> x.companyId == value);
    this.companyName = this.assignedCompany[index].companyName;
    this.localStorageService.storeCompanyId(this.assignedCompany[index]);
    // this.localStorageService.storeCompanyId(value);
    this.companyId = value;
    
    this.getCompanyReportDetails();
  }

  publishedData : any 
  getCompanyReportDetails(){
    const publishedArr = [];
    this.SpinnerService.show();
    const id = Number(this.companyId? this.companyId: 0);
    this.globalCodeService.getAssignedCompanyReportDetail({companyId:id, page:0, limit:0, orderBy:"ReportDate", orderByDescending:true, allRecords:true}).subscribe(res => {
      this.companyReportDetailList = res.companyReportDetailResponses;
      this.reportListDataForFilter = res.companyReportDetailResponses;
      if(this.companyReportDetailList && this.companyReportDetailList.length > 0){
        this.companyReportDetailList.forEach((publishData: any) => {
          if(publishData.archived==0 && publishData.reportStatus == 'Publish'){
            publishedArr.push(publishData);
          }
        });
       
        this.notFound = false;
        
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          this.SpinnerService.hide();
        }, 500);
        
      }else{ 
        
        this.notFound = true;
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          this.SpinnerService.hide();
        }, 500);
        if(this.intValue == 1){
          this.getCompanyReportDetails();
          this.intValue = 2;
        }
        
      }
    })
  }

  viewFullCmReport(object: any){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "companyId" : this.companyId,
        "reportDate":object.reportDate,
        "engineerName": object.engineerName,
        "companyReportDetailId": object.companyReportDetailId,
        "printClass": true,
        "collectedBy": object.collectedBy
        
      }
    };
    this.router.navigate(["/admin/full-cm-report-detail"], navigationExtras)
    
  }

 

  engineers : any;
  getUserByAccount(){
    this.userService.getUserByAccountType({accountTypeName:"Admin", page:0, limit:0, orderBy:"CreatedOn", orderByDescending:true, allRecords:true}).subscribe(res => {
      this.engineers = res.userResponsesList;
      this.engineers = this.globalCodeService.sortByAlphabetical(this.engineers,'contactName');
      
    }, (error: any) => {
    })
  }

  //Delete Draft Report and Save PDF
  deleteReport(id: number, archiveId: number){
      let companyReportDetailId = Number(id? id: 0);
      let companyReportDetailArchivId = Number(archiveId? archiveId: 0);
      let confirmation = confirm('Do you want to delete this Report?');
      if(confirmation){
      this.reportWizardService.deleteReport({companyReportDetailId: companyReportDetailId, companyReportDetailArchivId: companyReportDetailArchivId}).subscribe(res => {
        this.toastr.success('Successfully', res.message, {
          timeOut: 2000
        });
        this.getCompanyReportDetails();
      })
    }
  }
 
  
  uploadPdf(fileInput: any){
    const reader = new FileReader();
    const file = fileInput.target.files[0];
    reader.readAsDataURL(file);
    const fileType = file.type.split('/')[1];
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      this.pdfDetails.fileInBase64 = String(reader.result).split(',')[1];
      this.pdfDetails.fileType = fileType;
    }
  }

  // Save PDF
  pdfDetailsSubmit(form: any){
    this.pdfDetails.companyId = Number(this.companyId? this.companyId : 0);
    if(form.valid){
      if(this.pdfDetails.reportDate){
        this.pdfDetails.reportDate = moment(this.pdfDetails.reportDate).add(1, "day").format();
      }else{
        this.pdfDetails.reportDate = moment().format();
      }
    this.SpinnerService.show();
      this.globalCodeService.saveCMSurveyPDF(this.pdfDetails).subscribe(res => {
        this.toastr.success('Successfully', res.message, {
          timeOut: 2000
        });
        this.getCompanyReportDetails();
        this.pdfDetails.fileInBase64 = '';
        this.pdfDetails.fileType = '';
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          this.SpinnerService.hide();
        }, 500);
        form.resetForm();
        form.form.reset();
      }, (error: any) => {
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          this.SpinnerService.hide();
        }, 500);
        this.toastr.error('error', error.error, {
          timeOut: 2000
        });
      })
    }
    

  }

  //Edit Report
  editDraft(object: any){
    if(this.accountType == 'Admin'){
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "reportDate": object.reportDate,
          "userId": object.userId,
          "companyId": this.companyId,
          "crdId": object.companyReportDetailId,
          "collectedBy": object.collectedBy,
          "companyName": this.compName,
          "reportTitle": object.reportTitle
        }
      };
      this.router.navigate(["/admin/report-wizard"], navigationExtras);
    }else{
      this.toastr.warning('', 'Only the Admin can edit the report', {
        timeOut: 2000
      });
    }
  }

  searchFilter(searchTerm: string){
      searchTerm = searchTerm.trim();
      const allReport = this.reportListDataForFilter;
      if(!searchTerm){
        this.notFound = false;
        this.companyReportDetailList = this.reportListDataForFilter;
      }
  
      const searchedlist = allReport.filter((report: any) => {
        const reportDate = report.reportDate.toLowerCase().includes(searchTerm.toLowerCase());
        const reportTitle = report.reportTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const status = report.reportStatus.toLowerCase().includes(searchTerm.toLowerCase());
        return reportDate || reportTitle || status;
      })
      this.notFound = searchedlist?.length == 0;
      this.companyReportDetailList = searchedlist;
  }

  ngOnDestroy(){
    this.searchFilterSub.unsubscribe();
  }

  //Print Function
  print(object: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "companyId" : this.companyId,
        "reportDate":object.reportDate,
        "engineerName": object.engineerName,
        "companyReportDetailId": object.companyReportDetailId,
        "collectedBy": object.collectedBy,
        "print": true
        
      }
    };
    this.router.navigate(["/admin/full-cm-report-detail"], navigationExtras);

  }

}
