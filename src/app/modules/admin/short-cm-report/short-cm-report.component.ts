import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { BaseUrl } from '../../../config/url-config';
import { Subscription } from 'rxjs';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ReportWizardService } from '../../../core/services/report-wizard.service';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';
import { ExcelFormatService } from '../../../core/services/excel.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-short-cm-report',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  templateUrl: './short-cm-report.component.html',
  styleUrl: './short-cm-report.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShortCmReportComponent {
  @ViewChild('TABLE') table!: ElementRef;

  api = BaseUrl.apiUrl;
  ShortCMTable: string[] = ['CMP No', 'Area', 'Asset Id', 'Alarm Color', 'Primary Issues', 'Secondary Issues', 'Recommendations', 'Sap No', 'Priority'];
  assignedCompany: any;
  userId: any;
  ShortCMReportList: any;
  companyId: number = 0;
  noAssign!: boolean;
  assign!: boolean;
  companyName!: string;
  reportDate!: string;
  companyReportDetailList: any;
  intValue!: number;
  notFound: boolean = true;
  companyReportPDFData = [];
  accountType: any;
  shortCmData: boolean = true;
  searchFilterSub: Subscription;
  reportListDataForFilter: any;
  showDatesRow: boolean = false;
  shortCMResponsesListData: any = [];

  // 🔹 Added UI-only variables for filter inputs
  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private localStorageService: LocalStorageService,
    private globalService: GlobalCodeService,
    private SpinnerService: NgxSpinnerService,
    private reportWizardService: ReportWizardService,
    private toastr: ToastrService,
    private router: Router,
    private excelFormatService: ExcelFormatService
  ) {
    this.searchFilterSub = this.globalService.searchFilter$.subscribe(value => {
      this.searchFilter(value);
    });
  }

  ngOnInit(): void {
    this.bindDropdown();
    const user = this.localStorageService.getUserCredentials();
    this.userId = user.userId;
    this.accountType = user.accountType.accountTypeName;
    const compId = this.localStorageService.getCompanyId();
    this.companyId = compId.companyId || 0;
    this.companyName = compId.companyName;
    this.getCompanyReportDetails();
  }

  getCompanyReportDetails() {
    this.SpinnerService.show();
    const id = Number(this.companyId ? this.companyId : 0);
    this.globalService.getAssignedCompanyReportDetail({ companyId: id, page: 0, limit: 0, orderBy: "ReportDate", orderByDescending: true, allRecords: true }).subscribe(res => {
      this.companyReportDetailList = res.companyReportDetailResponses;
      this.reportListDataForFilter = res.companyReportDetailResponses;
      if (this.companyReportDetailList && this.companyReportDetailList.length > 0) {

        this.notFound = false;
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          this.SpinnerService.hide();
        }, 500);

      } else {
        // this.companyName = null;
        this.notFound = true;
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          this.SpinnerService.hide();
        }, 500);
        if (this.intValue == 1) {
          this.getCompanyReportDetails();
          this.intValue = 2;
        }

      }
    })
  }

  //Delete Draft Report and Save PDF
  deleteReport(id: number, archiveId: number, reportDate: string) {
    let companyReportDetailId = Number(id ? id : 0);
    let companyReportDetailArchivId = Number(archiveId ? archiveId : 0);
    let confirmation = confirm('Do you want to delete this Report?');
    if (confirmation) {
      if (this.ShortCMReportList) {
        if (this.ShortCMReportList.filteredData[0].reportDate == reportDate) {
          this.ShortCMReportList = "";
          this.shortCmData = true;
        }
      }
      this.reportWizardService.deleteReport({ companyReportDetailId: companyReportDetailId, companyReportDetailArchivId: companyReportDetailArchivId }).subscribe(res => {
        this.toastr.success('Successfully', res.message, {
          timeOut: 2000
        });
        this.getCompanyReportDetails();

      })
    }
  }

  //Edit Report
  editDraft(object: any) {
    if (this.accountType == 'Admin') {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "reportDate": object.reportDate,
          "userId": object.userId,
          "companyId": this.companyId,
          "crdId": object.companyReportDetailId,
          "collectedBy": object.collectedBy,
          "companyName": this.companyName,
          "reportTitle": object.reportTitle
        }
      };
      this.router.navigate(["/admin/report-wizard"], navigationExtras);
    } else {
      this.toastr.warning('', 'Only the Admin can edit the report', {
        timeOut: 2000
      });
    }
  }

  viewFullCmReport(companyReportDetailId: number) {
    this.getShortCMReportList(companyReportDetailId);
  }

  getShortCMReportList(companyReportDetailId: any) {
    const id = Number(this.companyId ? this.companyId : 0);
    this.globalService.getShortCMReportList({ companyId: id, companyReportDetailId: companyReportDetailId, page: 0, limit: 0, orderBy: "CreatedOn", orderByDescending: true, allRecords: true }).subscribe((res: any) => {
      this.ShortCMReportList = new MatTableDataSource(res.shortCMResponsesList);
      if (this.ShortCMReportList.filteredData) {
        this.shortCmData = false;
        this.companyName = this.ShortCMReportList.filteredData[0].companyName;
        this.reportDate = this.ShortCMReportList.filteredData[0].reportDate;
      } else {
        this.shortCmData = true;
      }
      // console.log(res.shortCMResponsesList);
      this.shortCMResponsesListData = res.shortCMResponsesList;
    }, error => {

    })
  }

  bindDropdown() {
    const user = this.localStorageService.getUserCredentials();
    this.userId = user.userId;
    this.globalService.getAssignedCompany({ userId: this.userId }).subscribe(res => {
      this.assignedCompany = res.assignedUserCompanies;
      if (this.assignedCompany) {

        if (this.companyId == 0) {
          this.companyId = this.assignedCompany[0].companyId;
        }

        this.getCompanyReportDetails();
        this.assign = true;
        this.noAssign = false;
      } else {

        this.companyId = 0;
        this.assign = false;
        this.noAssign = true;
      }
    })
  }

  getByCompanyId(event: any) {
    this.companyId = event.target.value;
    this.shortCmData = true;
    const index = this.assignedCompany.findIndex((x: any) => x.companyId == this.companyId);
    this.companyName = this.assignedCompany[index].companyName;
    this.localStorageService.storeCompanyId(this.assignedCompany[index]);

    this.ShortCMReportList = null;
    this.reportDate = "";

    this.getCompanyReportDetails();

  }

  searchFilter(searchTerm: string) {
    searchTerm = searchTerm.trim();
    const allReport = this.reportListDataForFilter;
    if (!searchTerm) {
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

  exportTOExcel() {
    const excelData = this.ShortCMReportList.filteredData;
    this.excelFormatService.generateExcel(excelData, this.companyName, this.reportDate);
  }


  ngOnDestroy() {
    this.searchFilterSub.unsubscribe();
  }

  print(companyReportDetailId: number): void {
    this.getShortCMReportList(companyReportDetailId);
    setTimeout(function () {
      let printContents, popupWin, printbutton;
      // Syscraft comment
      // printbutton = document.getElementById('inputprintbutton').style.display = "none";
      // printContents = document.getElementById('shorcmtablediv').innerHTML;
      printbutton = document.getElementById('inputprintbutton')!.style.display = "none";
      printContents = document.getElementById('shorcmtablediv')!.innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      // Syscraft comment
      // popupWin.document.open();
      // popupWin.document.write(`

      popupWin!.document.open();
      // Syscraft change .mat-table from .table css class name because .mat-table is not working
      popupWin!.document.write(`
    <html>
      <head>
    
        <title>Print tab</title>
        <style media="print">
        * {
          -webkit-print-color-adjust: exact !important; /*Chrome, Safari */
          color-adjust: exact !important;  /*Firefox*/
          }
          .table{
            border: 1px solid #dee2e6;
           }
          .table > thead > tr{
           background-color:#000;  
          }
          .table > thead > tr > th{
            color:#fff;  padding:2px;
            font-size:14px;    
            font-family: Roboto, "Helvetica Neue", sans-serif;
           }
           .table > thead > tr > th:first-child{
            width:65px;
           }
           .table > thead > tr > th:nth-child(2)
           {
            width:55px;
           }
           .table > thead > tr > th:nth-child(3)
           {
            width:55px;
           }
           .table > thead > tr > th: th:nth-child(4)
           {
            min-width:100px;
           }
           .table > thead > tr > th: th:nth-child(5)
           {
            width:100px;
           }
           .table > thead > tr > th: th:nth-child(6)
           {
            width:70px;
           }
           .table > tbody > tr > td{
            padding:6px 2px;
            font-size:12px;
            vertical-align:middle;
            text-align:center;
            font-family: Roboto, "Helvetica Neue", sans-serif;
            font-weight:400;
           
           }
           .float-right{
             float: right;
           }
           .card-header{
            margin:0 0 20px 0;
            font-family: Roboto, "Helvetica Neue", sans-serif;
           }
           .table > tbody > tr:nth-child(even) {
            background: #f5f5f5;
        }
        .table > tbody > tr:nth-of-type(odd) {
          background-color: rgba(0, 0, 0, 0.05);
      }
        //........Customized style.......
        </style>
      </head>
  <body onload="window.print();window.close()">${printContents}</body>
    </html>`
      );

      // Syscraft comment
      // printbutton = document.getElementById('inputprintbutton').style.display = "inline-block";
      // popupWin.document.close();
      printbutton = document.getElementById('inputprintbutton')!.style.display = "inline-block";
      popupWin!.document.close();
    }, 2000);

  }
}
