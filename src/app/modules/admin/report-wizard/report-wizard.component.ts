import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CDRResponse, CompanyReportReadingIssue, ReportDetailsFormLoad } from '../../../core/models/report-wizard.model';
import { CompanyService } from '../../../core/services/company.service';
import { UserService } from '../../../core/services/user.service';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { ReportWizardService } from '../../../core/services/report-wizard.service';
import moment from 'moment';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { forkJoin } from 'rxjs';
import { ReportIssueFormComponent } from './report-issue-form/report-issue-form.component';
import { CommonModule } from '@angular/common';
import { ReportDetailsFormComponent } from './report-details-form/report-details-form.component';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-report-wizard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    ReportIssueFormComponent,
    ReportDetailsFormComponent,
    MatTableModule,
    MatSelectModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './report-wizard.component.html',
  styleUrl: './report-wizard.component.scss'
})
export class ReportWizardComponent {
  reportIssueStatusColors: string[] = ['yellow', 'red', 'green'];
  detailsForm: ReportDetailsFormLoad = {
    companyId: 0,
    userId: 0,

    // Syscraft comment
    // reportDate: null,
    reportDate: "",
    crdId: 0,

    // Syscraft comment
    // collectedBy: null,
    // reportTitle: null

    collectedBy: "",
    reportTitle: ""
  };

  // Syscraft comment
  // companyReportDetailsId: number;
  companyReportDetailsId!: number;

  companyReportDetail: any = [];
  companyReportDetail1: any = [];
  companyReportDetail2: any = [];

  companyReportIssues: CompanyReportReadingIssue[] = [];

  customerName: any;
  userName: any;
  readingStatues: any = [];
  userId: any;
  companyId: any;
  notFound: boolean = true;
  filterchange: boolean = false;
  createclick: number = 1;

  submitted: boolean = false;
  hideIssuesForm: boolean = false;
  storedcompanyReportIssues: any = [];
  constructor(
    // Syscraft comment
    // private embedService: EmbedVideoService,
    private companyService: CompanyService,
    private userService: UserService,
    private globalCodeService: GlobalCodeService,
    private localStorageService: LocalStorageService,
    private globalService: GlobalCodeService,
    private reportWizardService: ReportWizardService,
    private toastr: ToastrService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,

  ) { }


  ngOnInit(): void {
    // this.getAllCompanyName();
    this.getCurrentStatus();
    // this.getAllCompanyDetailsData();
    const userid = this.localStorageService.getUserCredentials();
    this.userId = userid.userId;
    this.route.queryParams.subscribe((params: any) => {
      this.detailsForm.companyId = params.companyId;
      this.detailsForm.reportDate = params.reportDate;
      this.detailsForm.userId = params.userId;
      this.detailsForm.crdId = params.crdId;
      this.detailsForm.companyName = params.companyName;
      this.detailsForm.reportTitle = params.reportTitle
    })
    this.saveCompanyReportDetail(this.detailsForm);
    this.companyId = this.detailsForm.companyId;
  }


  createReadingIssueModel(companyId: any, companyReportDetailReadingId: any, issuesid: any, area_name: any, asset_name: any, company_name: any, status_color: any) {
    let readingIssue: CompanyReportReadingIssue = {
      companyId: companyId,
      companyReportDetailIssuesId: issuesid,
      companyReportDetailReadingId: companyReportDetailReadingId,
      companyReportDetailId: this.companyReportDetailsId,
      // Syscraft comment
      // vibrationTypeId: null,
      // value: null,
      // unitsId: null,
      // brgId: null,
      // graph: null,
      // graphImageExsisting:null,
      // primaryIssue: null, 
      // secondaryIssue: null,
      // longDescription: null,
      // shortDescription: null,
      // primaryFaultId: null,
      // secondaryFalutId: null,
      // priorityNoId: null,

      vibrationTypeId:  0,
      value:  0,
      unitsId:  0,
      brgId:  0,
      graph: null as any,
      graphImageExsisting: "",
      primaryIssue: "",
      secondaryIssue: "",
      longDescription: "",
      shortDescription: "",
      primaryFaultId:  0,
      secondaryFalutId:  0,
      priorityNoId:  0,
      systemImagesResponses: [],
      systemVideoResponses: [],
      isPublish: false,
      issuesImages: [],
      issuesVideos: [],
      deletedSystemImages: [],
      deletedSystemVideos: [],
      sendMail: false,
      withoutIssues: true,
      companyDetail: { assetId: asset_name, companyArea: area_name, companyNo: company_name, stausColor: status_color }
    }
    return readingIssue;
  }


  getCurrentStatus() {
    this.globalCodeService.getGlobalCodeCategory({ name: "AlarmColor" }).subscribe(res => {
      this.readingStatues = res.data.globalCodeMainResponse.globalCodeResponse;
    })
  }


  colorStatus: any;

  // Syscraft comment
  // fullReportedDate: string;
  fullReportedDate!: string;
  date: any;
  colorValueArr: any;
  colorValueArr1: any;
  colorValueArr2: any;

  // Syscraft comment
  // companyReportDetailId: number;
  companyReportDetailId!: number;
  readingId: any;
  saveCompanyReportDetail(reportDetailsForm: any) {
    this.date = new Date(reportDetailsForm.reportDate);
    if (this.date != "Invalid Date") {
      // this.fullReportedDate = moment(this.date).add(1, 'day').format();
      this.fullReportedDate = moment(this.date).format("YYYY-MM-DD");
    } else {
      this.fullReportedDate = moment().format("YYYY-MM-DD");
    }
    this.detailsForm = reportDetailsForm;

    this.createclick = this.createclick + 1;

    let dataToSend = {
      companyId: Number(this.detailsForm.companyId ? this.detailsForm.companyId : 0),
      reportDate: this.fullReportedDate,
      userId: Number(this.detailsForm.userId ? this.detailsForm.userId : 0),
      crdId: Number(this.detailsForm.crdId ? this.detailsForm.crdId : 0),
      collectedBy: this.detailsForm.collectedBy,
      reportTitle: this.detailsForm.reportTitle
    }
    if (dataToSend.companyId) {

      this.reportWizardService.getCompanyDetailReading(dataToSend).subscribe(res => {

        if (res.status) {
          this.companyReportDetailsId = res.companyReportDetailsId;
          this.storedcompanyReportIssues = res.companyReportIssues;
          if (this.storedcompanyReportIssues.length > 0) this.globalCodeService.sortByCMPNo(this.storedcompanyReportIssues);
          this.companyReportIssues = this.storedcompanyReportIssues;
          this.companyReportDetail = res.cdrResponses;
          if (this.companyReportDetail != null && this.companyReportDetail.length > 0) {
            this.notFound = false;
            this.filterchange = false;
            this.companyReportDetail = this.globalService.sortByNumeric(this.companyReportDetail, "companyDetailId");

            this.companyReportDetail.map((data: any) => {
              let requst = {
                companyDetailsId: Number(data.companyDetailId ? data.companyDetailId : 0),
                companyReportDetailsId: Number(res.companyReportDetailsId ? res.companyReportDetailsId : 0),
                status: Number(data.currentStatus.globalCodeId ? data.currentStatus.globalCodeId : 0),
                checkBoxStatus: false
              };
              if (data.companyReportDetailId == null) {
                this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {
                });
              }
              return data;
            })

            this.colorValueArr = this.companyReportDetail.map((data: any) => data.currentStatus);
            const id = this.companyReportDetail.map((data: any) => {
              this.companyReportDetailId = data.companyReportDetailIssueId;

              if (data.currentStatus.globalCodeName == "N/R") {
                this.companyReportDetailId = 0;
              }

              if (this.companyReportDetailId) {
                data.checkedValue = true;
                data.checkNumber = 1;
                this.hideIssuesForm = true;
              } else {
                data.checkedValue = false;
              }
            });

            this.splitData(this.companyReportDetail, this.colorValueArr);

          } else {
            this.notFound = true;
            this.filterchange = false;
            this.companyReportDetail = null;
            this.companyReportDetail1 = null;
            this.companyReportDetail2 = null;
            this.colorValueArr1 = null;
            this.colorValueArr2 = null;
          }
        }

      })
    }

  }

  colorCode: any;
  currentReadingStatus: any;
  previousReadingStatus: any;

  // Syscraft comment
  // colorStausValue: boolean;
  // checkboxValue: boolean;

  colorStausValue!: boolean;
  checkboxValue!: boolean;
  readingStatusChange(readingStatus: number, report: CDRResponse, index: number, setIdentifier: number) {
    if (setIdentifier == 1) {
      this.colorStausValue = this.colorValueArr1[index].currentStatus.checkedValue;
    } else {
      this.colorStausValue = this.colorValueArr2[index].currentStatus.checkedValue;
    }
    let statusDetails = this.readingStatues.find((x: any) => x.globalCodeId == readingStatus);
    this.currentReadingStatus = statusDetails.codeName.toLowerCase();
    this.previousReadingStatus = report.currentStatus.globalCodeName.toLowerCase();
    let currentStatus = {
      globalCodeId: readingStatus,
      globalCodeName: statusDetails.codeName,
      checkedValue: this.colorStausValue
    };

    if (setIdentifier == 1) {
      this.companyReportDetail1[index].currentStatus = currentStatus;
      if (this.colorValueArr1[index].currentStatus.checkedValue == true) {
        this.colorValueArr1[index].currentStatus.checkedValue = true;
        this.checkboxValue = true;
      }

      if (this.companyReportDetail1[index].companyReportDetailId && this.companyReportDetail1[index].checkNumber == 1) {
        this.checkboxValue = true;
      } else if (this.companyReportDetail1[index].checkNumber == 1) {
        this.checkboxValue = true;
      } else {
        this.checkboxValue = false;
      }
    } else {
      this.companyReportDetail2[index].currentStatus = currentStatus;
      if (this.colorValueArr2[index].currentStatus.checkedValue == true) {
        this.colorValueArr2[index].currentStatus.checkedValue = true;
        this.checkboxValue = true;
      }

      if (this.companyReportDetail2[index].companyReportDetailId && this.companyReportDetail2[index].checkNumber == 1) {
        this.checkboxValue = true;
      } else if (this.companyReportDetail2[index].checkNumber == 1) {
        this.checkboxValue = true;
      } else {
        this.checkboxValue = false;
      }
    }


    if (readingStatus == 4) {
      if (setIdentifier == 1) {
        if (this.colorValueArr1[index].currentStatus.checkedValue == true) {
          this.colorValueArr1[index].currentStatus.checkedValue = false;
        }
        this.colorValueArr1[index].checkedValue = false;
      } else {
        if (this.colorValueArr2[index].currentStatus.checkedValue == true) {
          this.colorValueArr2[index].currentStatus.checkedValue = false;
        }
        this.colorValueArr2[index].checkedValue = false;
      }
    }


    if (this.checkboxValue == true && readingStatus == 4) {
      if (setIdentifier == 1) {
        this.colorCode = this.colorValueArr1[index].currentStatus.globalCodeId;
      } else {
        this.colorCode = this.colorValueArr2[index].currentStatus.globalCodeId;
      }
      let requst = {
        companyDetailsId: Number(report.companyDetailId ? report.companyDetailId : 0),
        companyReportDetailsId: Number(this.companyReportDetailsId ? this.companyReportDetailsId : 0),
        status: Number(this.colorCode ? this.colorCode : 0)
      };
      this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {
        const readingId = response.companyDetailReadingId;
        let readingIndex = this.companyReportIssues.findIndex(x => x.companyReportDetailReadingId == readingId);
        if (readingIndex > -1) this.companyReportIssues.splice(readingIndex, 1);
        if (setIdentifier == 1) {
          this.companyReportDetail1[index].checkNumber = 0;
        } else {
          this.companyReportDetail2[index].checkNumber = 0;
        }
      })
    }


    if (setIdentifier == 1) {
      if (this.checkboxValue == true && readingStatus != 5) {
        if (setIdentifier == 1) {
          this.colorCode = this.colorValueArr1[index].currentStatus.globalCodeId;
        } else {
          this.colorCode = this.colorValueArr2[index].currentStatus.globalCodeId;
        }
        let requst = {
          companyDetailsId: Number(report.companyDetailId ? report.companyDetailId : 0),
          companyReportDetailsId: Number(this.companyReportDetailsId ? this.companyReportDetailsId : 0),
          status: Number(this.colorCode ? this.colorCode : 0)
        };
        this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {
          this.checkboxValue = false;
          this.readingId = response.companyDetailReadingId;
          this.companyId = this.detailsForm.companyId;
          const stausColor = response.detailsReadingsResponse.stausColor;
          const isPreviousStatusWasIssueStatus = this.reportIssueStatusColors.indexOf(this.previousReadingStatus) !== -1;
          const isCurrentStatusIsIssueStatus = this.reportIssueStatusColors.indexOf(this.currentReadingStatus) !== -1;
          if (isPreviousStatusWasIssueStatus && isCurrentStatusIsIssueStatus) { // Change the Issue status color
            let readingIndex = this.companyReportIssues.findIndex(x => x.companyReportDetailReadingId == this.readingId);
            this.companyReportIssues[readingIndex].companyDetail.stausColor = stausColor;
          }
        })
      }
    } else {
      if (this.checkboxValue == true && readingStatus != 5) {
        if (setIdentifier == 1) {
          this.colorCode = this.colorValueArr1[index].currentStatus.globalCodeId;
        } else {
          this.colorCode = this.colorValueArr2[index].currentStatus.globalCodeId;
        }
        let requst = {
          companyDetailsId: Number(report.companyDetailId ? report.companyDetailId : 0),
          companyReportDetailsId: Number(this.companyReportDetailsId ? this.companyReportDetailsId : 0),
          status: Number(this.colorCode ? this.colorCode : 0)
        };
        this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {
          this.checkboxValue = false;
          this.readingId = response.companyDetailReadingId;
          this.companyId = this.detailsForm.companyId;
          const stausColor = response.detailsReadingsResponse.stausColor;
          const isPreviousStatusWasIssueStatus = this.reportIssueStatusColors.indexOf(this.previousReadingStatus) !== -1;
          const isCurrentStatusIsIssueStatus = this.reportIssueStatusColors.indexOf(this.currentReadingStatus) !== -1;
          if (isPreviousStatusWasIssueStatus && isCurrentStatusIsIssueStatus) { // Change the Issue status color
            let readingIndex = this.companyReportIssues.findIndex(x => x.companyReportDetailReadingId == this.readingId);
            this.companyReportIssues[readingIndex].companyDetail.stausColor = stausColor;
          }
        })
      }
    }

    if (statusDetails.codeName == "N/R") {
      currentStatus.globalCodeName = "white";
    }
    if (readingStatus == 5) {
      if (setIdentifier == 1) {
        this.colorCode = this.colorValueArr1[index].currentStatus.globalCodeId;
      } else {
        this.colorCode = this.colorValueArr2[index].currentStatus.globalCodeId;
      }
      let requst = {
        companyDetailsId: Number(report.companyDetailId ? report.companyDetailId : 0),
        companyReportDetailsId: Number(this.companyReportDetailsId ? this.companyReportDetailsId : 0),
        status: Number(this.colorCode ? this.colorCode : 0),
        checkBoxStatus: false
      };
      this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {
        const readingId = response.companyDetailReadingId;
        if (readingId) {
          let readingIndex = this.companyReportIssues.findIndex(x => x.companyReportDetailReadingId == readingId);
          if (readingIndex > -1) this.companyReportIssues.splice(readingIndex, 1);
          if (setIdentifier == 1) {
            this.companyReportDetail1[index].checkNumber = 0;
          } else {
            this.companyReportDetail2[index].checkNumber = 0;
          }
        }
      })
    }

    // if(readingStatus != 4){
    if (readingStatus != 5) {
      if (setIdentifier == 1) {
        this.colorCode = this.colorValueArr1[index].currentStatus.globalCodeId;
      } else {
        this.colorCode = this.colorValueArr2[index].currentStatus.globalCodeId;
      }
      let requst = {
        companyDetailsId: Number(report.companyDetailId ? report.companyDetailId : 0),
        companyReportDetailsId: Number(this.companyReportDetailsId ? this.companyReportDetailsId : 0),
        status: Number(this.colorCode ? this.colorCode : 0),
        checkBoxStatus: false
      };
      if (setIdentifier == 1) {
        if (this.colorValueArr1[index].checkedValue == true) {
          requst.checkBoxStatus = true;
        } else {
          requst.checkBoxStatus = false;
        }
      } else {
        if (this.colorValueArr2[index].checkedValue == true) {
          requst.checkBoxStatus = true;
        } else {
          requst.checkBoxStatus = false;
        }
      }
      this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {
      });
    }

  }

  showOptions(event: MatCheckboxChange, report: CDRResponse, index: number, setIdentifier: number): void {

    if (setIdentifier == 1) {
      this.colorCode = this.colorValueArr1[index].currentStatus.globalCodeId;
    } else {
      this.colorCode = this.colorValueArr2[index].currentStatus.globalCodeId;
    }
    this.checkboxValue = event.checked;
    if (event.checked === true) {
      this.hideIssuesForm = true;

      let requst = {
        companyDetailsId: Number(report.companyDetailId ? report.companyDetailId : 0),
        companyReportDetailsId: Number(this.companyReportDetailsId ? this.companyReportDetailsId : 0),
        status: Number(this.colorCode ? this.colorCode : 0),
        checkBoxStatus: true
      };
      this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {
        if (response.status) {
          let statusDetails = this.readingStatues.find((x: any) => x.globalCodeId == this.colorCode);
          if (!statusDetails) return;
          const isPreviousStatusWasIssueStatus = this.reportIssueStatusColors.indexOf(this.previousReadingStatus) !== -1;
          const isCurrentStatusIsIssueStatus = this.reportIssueStatusColors.indexOf(this.currentReadingStatus) !== -1;
          const readingId = response.companyDetailReadingId;
          const issuesid = response.companyReportDetailIssuesId;
          const asset = response.detailsReadingsResponse.assetName;
          const area = response.detailsReadingsResponse.companyArea;
          const companyNo = response.detailsReadingsResponse.companyNo;
          const stausColor = response.detailsReadingsResponse.stausColor;
          const companyId = this.detailsForm.companyId;
          if (!isPreviousStatusWasIssueStatus && isCurrentStatusIsIssueStatus) {

            // Issue Status case, Add Report Issue
            let readingIssue = this.createReadingIssueModel(companyId, readingId, issuesid, area, asset, companyNo, stausColor);
            this.storedcompanyReportIssues.push(readingIssue)
            this.globalCodeService.sortByCMPNo(this.storedcompanyReportIssues);
            this.companyReportIssues = this.storedcompanyReportIssues;

          } else if (isPreviousStatusWasIssueStatus && !isCurrentStatusIsIssueStatus) {
            // Issue Status case, Add Report Issue
            let readingIssue = this.createReadingIssueModel(companyId, readingId, issuesid, area, asset, companyNo, stausColor);

            this.storedcompanyReportIssues.push(readingIssue)
            this.globalCodeService.sortByCMPNo(this.storedcompanyReportIssues);
            this.companyReportIssues = this.storedcompanyReportIssues;
          }
          if (isPreviousStatusWasIssueStatus && isCurrentStatusIsIssueStatus) {
            let readingIssue = this.createReadingIssueModel(companyId, readingId, issuesid, area, asset, companyNo, stausColor);

            this.storedcompanyReportIssues.push(readingIssue)
            this.globalCodeService.sortByCMPNo(this.storedcompanyReportIssues);
            this.companyReportIssues = this.storedcompanyReportIssues;
          }
          if (!isPreviousStatusWasIssueStatus && !isCurrentStatusIsIssueStatus) {
            let readingIssue = this.createReadingIssueModel(companyId, readingId, issuesid, area, asset, companyNo, stausColor);

            this.storedcompanyReportIssues.push(readingIssue)
            this.globalCodeService.sortByCMPNo(this.storedcompanyReportIssues);
            this.companyReportIssues = this.storedcompanyReportIssues;
          }

          let currentStatus = {
            globalCodeId: this.colorCode,
            globalCodeName: statusDetails.codeName
          };
          if (setIdentifier == 1) {
            this.companyReportDetail1[index].currentStatus = currentStatus;
            this.colorValueArr1[index].currentStatus.checkedValue = true;
            this.colorValueArr1[index].checkedValue = true;
            this.companyReportDetail1[index].checkNumber = 1;

          } else {
            this.companyReportDetail2[index].currentStatus = currentStatus;
            this.colorValueArr2[index].currentStatus.checkedValue = true;
            this.colorValueArr2[index].checkedValue = true;
            this.companyReportDetail2[index].checkNumber = 1;
          }
          this.checkboxValue = false;

        } else {
          alert("Error while changing reading");
        }
      })
    } else {
      let requst = {
        companyDetailsId: Number(report.companyDetailId ? report.companyDetailId : 0),
        companyReportDetailsId: Number(this.companyReportDetailsId ? this.companyReportDetailsId : 0),
        status: Number(this.colorCode ? this.colorCode : 0),
        checkBoxStatus: false
      };
      this.reportWizardService.changedCompanyDetailsReading(requst).subscribe(response => {

        let statusDetails = this.readingStatues.find((x: any) => x.globalCodeId == this.colorCode);

        let currentStatus = {
          globalCodeId: this.colorCode,
          globalCodeName: statusDetails.codeName
        };
        if (setIdentifier == 1) {
          this.companyReportDetail1[index].currentStatus = currentStatus;
        } else {
          this.companyReportDetail2[index].currentStatus = currentStatus;
        }
        const readingId = response.companyDetailReadingId;
        let readingIndex = this.companyReportIssues.findIndex(x => x.companyReportDetailReadingId == readingId);
        if (readingIndex > -1) this.companyReportIssues.splice(readingIndex, 1);
        this.hideIssuesForm = (this.companyReportIssues.length == 0) ? false : true;
        if (setIdentifier == 1) {
          this.colorValueArr1[index].checkedValue = false;
          this.companyReportDetail1[index].checkNumber = 0;
        } else {
          this.colorValueArr2[index].checkedValue = false;
          this.companyReportDetail2[index].checkNumber = 0;
        }
      })
    }
  }

  publishBtn: boolean = false;
  invalidFormIndex: any;
  saveAllIssues(reporttype: boolean) {
    // console.log('saveAllIssues', reporttype);
    this.publishBtn = true;
    this.submitted = true;
    if (this.companyReportIssues.length == 0) {
      this.companyReportIssues = [{
        companyId: this.companyId,

        // Syscraft comment
        // companyReportDetailIssuesId: null,
        // companyReportDetailReadingId: null,
        companyReportDetailIssuesId: 0,
        companyReportDetailReadingId: 0,
        companyReportDetailId: this.companyReportDetailsId ? this.companyReportDetailsId : this.readingId,

        // Syscraft comment
        // vibrationTypeId: null,
        // value: null,
        // unitsId: null,
        // brgId: null,
        // graph: null,
        // graphImageExsisting:null,
        // primaryIssue: null, 
        // secondaryIssue: null,
        // longDescription: null,
        // shortDescription: null,
        // primaryFaultId: null,
        // secondaryFalutId: null,
        // priorityNoId: null,

        vibrationTypeId: 0,
        value: 0,
        unitsId: 0,
        brgId: 0,
        graph: null as any,
        graphImageExsisting: "",
        primaryIssue: "",
        secondaryIssue: "",
        longDescription: "",
        shortDescription: "",
        primaryFaultId: 0,
        secondaryFalutId: 0,
        priorityNoId: 0,
        systemImagesResponses: [],
        systemVideoResponses: [],
        isPublish: false,
        issuesImages: [],
        issuesVideos: [],
        deletedSystemImages: [],
        deletedSystemVideos: [],
        sendMail: true,
        withoutIssues: false,

        // Syscraft comment
        // companyDetail: null
        companyDetail: null as any
      }]
    } else {
      // this.companyReportIssues.map(reportIssue => {
      //   reportIssue.withoutIssues = false;
      // })
    }



    this.invalidFormIndex = this.validateIssueForms();
    // this.companyReportIssues[this.invalidFormIndex].withoutIssues = true;

    for (let i = 0; i < this.companyReportIssues.length; i++) {
      if (this.companyReportIssues[i].withoutIssues == true) {
        // console.log('this.companyReportIssues[i].withoutIssues', this.companyReportIssues[i].withoutIssues);
        if (this.invalidFormIndex > -1) { // Form is invalid
          // this.issuePanelOpened(invalidFormIndex);

          this.toastr.error('Error', 'Issue form is invalid ', {
            timeOut: 2000
          });
          setTimeout(() => {
            this.scrollToActivePanel();
          });
          return;
        }
      }
    }

    this.SpinnerService.show();
    for (let i = 0; i < this.companyReportIssues.length; i++) {
      if (this.companyReportIssues[i].graph == null) {
        this.companyReportIssues[i].graph = [];
      }
    }
    for (let i = 0; i < this.companyReportIssues.length; i++) {
      if (this.companyReportIssues[i].sendMail == true) {
        this.companyReportIssues[i].sendMail == false;
      }
    }
    const last = this.companyReportIssues[this.companyReportIssues.length - 1];
    if (last) {
      last.sendMail = true;
    }
    let allPromises = this.companyReportIssues.map((reportIssue: any) => {
      delete reportIssue.systemImagesResponses;
      delete reportIssue.systemVideoResponses;
      if (this.companyReportIssues.length > 0) {
        reportIssue.isPublish = reporttype;
      }
      return this.reportWizardService.saveReportDetailIssue(reportIssue)
    });

    // Syscraft check deprecated
    forkJoin(...allPromises).subscribe((data: any) => {
      // const id = data[0].uniqueId;
      this.SpinnerService.hide();
      if (reporttype == true) {
        this.publishBtn = false;
        let data = { companyId: this.detailsForm.companyId, companyName: this.detailsForm.companyName };
        this.localStorageService.storeCompanyId(data);
        this.router.navigateByUrl("/admin/dashboard");
        // setTimeout(() =>{
        //   this.reportWizardService.setValue(true);

        // }, 500);
        this.toastr.success('successfully', 'Report Published', {
          timeOut: 2000
        });

      } else {
        this.router.navigateByUrl("/admin/dashboard");
        // setTimeout(() =>{
        //   this.reportWizardService.setValue(true);

        // }, 500);
        this.toastr.success('successfully', 'Report Saved', {
          timeOut: 2000
        });
        this.saveCompanyReportDetail(this.detailsForm);
      }
    }, error => {
      this.toastr.error('', "Somthing went wrong", {
        timeOut: 2000
      });
      this.SpinnerService.hide();
    });

  }

  // Should call on submittion
  validateIssueForms(): number {
    return this.companyReportIssues.findIndex(issueForm => {
      const { vibrationTypeId, value, unitsId, primaryIssue, primaryFaultId } = issueForm;
      return !vibrationTypeId || !value || !unitsId || !primaryIssue || !primaryFaultId;
    })
  }

  scrollToActivePanel() {
    let element = <HTMLElement>document.querySelector('#matAccordion > mat-expansion-panel.mat-expanded');
    if (element) element.scrollIntoView({ behavior: "smooth" });
  }


  issueFormChanged(objData: object, index: number) {
    let reportIssue = this.companyReportIssues[index];
    this.companyReportIssues[index] = {
      ...reportIssue,
      ...objData
    };
  }

  splitData(data: any, data2: any) {
    if (data != null) {
      const len = data.length,
        mid = len / 2;
      const len2 = data2.length,
        mid2 = len2 / 2;
      this.colorValueArr1 = data.slice(0, mid2);
      this.colorValueArr2 = data.slice(mid2, len2);
      this.companyReportDetail1 = data.slice(0, mid);
      this.companyReportDetail2 = data.slice(mid, len);
    }
    else {
      this.companyReportDetail1 = null;
      this.companyReportDetail2 = null;
      this.colorValueArr1 = null;
      this.colorValueArr2 = null;
    }

  }

  get readingIssues() {

    let readingIssuesList1 = this.extractReadingIssues(this.companyReportDetail1);
    let readingIssuesList2 = this.extractReadingIssues(this.companyReportDetail2);
    return readingIssuesList1.concat(readingIssuesList2);
  }

  extractReadingIssues(companyReportDetail: any) {
    return companyReportDetail.filter((x: any) => {
      let { globalCodeName } = x.currentStatus;
      let lowerCaseGlobalCodeName = globalCodeName ? globalCodeName.toLowerCase() : "";
      return ["yellow", "red", "green"].indexOf(lowerCaseGlobalCodeName) > -1;
    })
  }

  filterChanged(detailfiltervalues: any) {
    if (this.createclick > 1) {
      this.notFound = false;
      this.filterchange = true;

      // Syscraft comment
      // this.companyReportIssues = null;
      this.companyReportIssues = null as any;

      this.storedcompanyReportIssues = null;
    }
    else {
      this.notFound = true;
      this.filterchange = false;
    }
    this.companyReportDetail = null;
    this.companyReportDetail1 = null;
    this.companyReportDetail2 = null;

  }


  issuePanelOpened(i: any) {
    this.companyReportIssues.forEach((x, index) => x.current = index == i);
  }

  issuePanelClosed(i: any) {
    this.companyReportIssues.forEach((x, index) => {
      if (index == i) x.current = false;
    })
  }

}
