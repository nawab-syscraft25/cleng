import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { BaseUrl } from '../../../config/url-config';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CommonModule, Location } from '@angular/common';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../../core/services/message.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-full-cm-report',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    RouterModule,
    CarouselModule,
    FormsModule,
    NgApexchartsModule,
  ],
  templateUrl: './full-cm-report.component.html',
  styleUrl: './full-cm-report.component.scss',
})
export class FullCmReportComponent {
  api = BaseUrl.apiUrl;
  fullCmReportList: any;

  // Syscraft comment 
  // msgInputTxt: '';
  msgInputTxt!: '';
  msgList = [];
  assignedCompany: any;

  // Syscraft comment
  // userId: number;
  userId!: number;
  messagesList: any[] = [];
  readingId: number = 0;
  compDetailId: number = 0;
  companyId: number = 0;
  notEmpty: boolean = false;
  emptyData: boolean = true;
  notFound: boolean = true;

  companyDetailId: number = 0;

  // Syscraft comment
  // imageError: string;
  // isImageSaved: boolean;
  // cardImageBase64: string;
  // imageType: string;

  imageError!: string;
  isImageSaved!: boolean;
  cardImageBase64!: string;
  imageType!: string;
  sliderImagePath: any[] = [];
  sliderVideoPath: any;
  locationPath: any;
  extention: any;
  qrData: any;

  // Syscraft comment
  // fileUrl;
  fileUrl: any;
  accountType!: string;
  pdfReportUrl: any;
  lastHistoricalAlarm!: any[];
  emptyHistoricalAlarm: boolean = true;

  imageUrl: any;
  imageVideoType: any;
  companyAreaFromDashboard!: string;
  assetIdFromDashboard!: string;
  showModal: boolean = false;
  imgUrl: any;
  overlay: boolean = false;
  indexNum!: number;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoWidth: true,
    navSpeed: 700,
    autoplay: false,
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


  constructor(
    private location: Location,
    private globalCodeService: GlobalCodeService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private messageServices: MessageService,
    private SpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    public dialog: MatDialog
  ) {
    // this.extention = "/cleng";
    const path = location.path();
    this.locationPath = window.location.origin + path;
  }


  ngOnInit(): void {

    const userAccount = this.localStorageService.getUserCredentials();
    this.accountType = userAccount.accountType.accountTypeName;

    this.route.queryParams.subscribe((params: any) => {
      this.companyId = params.companyId;
      this.readingId = params.companyReportDetailReadingId;
      this.companyAreaFromDashboard = params.companyArea;
      this.assetIdFromDashboard = params.assetId;
      this.compDetailId = params.companyDetailId;
      this.companyDetailId = params.companyDetailId;
    })

    const userId = this.localStorageService.getUserCredentials();
    this.userId = userId.userId;

    this.getFullCmReportData(this.readingId, this.compDetailId);
    this.getMessage();

  }

  companyNo: any;
  assetId: any;
  historicalAlarms: any;
  emptyGraphImage: boolean = true;
  getFullCmReportData(readingId: number, detailId: number) {
    this.SpinnerService.show();
    const id = Number(readingId ? readingId : 0);
    const compdetailId = Number(detailId ? detailId : 0);
    this.globalCodeService.getFullCMReportList({ companyReportDetailReadingId: id, companyDetailId: compdetailId }).subscribe(res => {
      if (res.fullCMResponse != 'null') {
        this.fullCmReportList = res.fullCMResponse;

        if (this.fullCmReportList && this.fullCmReportList != 'null') {
          this.companyDetailId = this.fullCmReportList.companyDetailId;
          if (this.fullCmReportList.companyArea && this.fullCmReportList.assetId) {
            this.companyNo = this.fullCmReportList.companyNo;
            this.assetId = this.fullCmReportList.assetId;
          } else {
            this.fullCmReportList.companyArea = this.companyAreaFromDashboard;
            this.fullCmReportList.assetId = this.assetIdFromDashboard;
            this.fullCmReportList.dateOfReading = null;
          }
          this.historicalAlarms = this.fullCmReportList.historicalAssetAlarms;
          if (this.fullCmReportList.graphDataImage) {
            this.emptyGraphImage = false;
          } else {
            this.emptyGraphImage = true;
          }
          if (this.fullCmReportList.systemImagesResponses) {
            if (this.fullCmReportList.systemImagesResponses[0]) {
              const fstImage = this.fullCmReportList.systemImagesResponses[0];
              this.sliderImagePath.push(fstImage);
            }
            if (this.fullCmReportList.systemImagesResponses[1]) {
              const secImage = this.fullCmReportList.systemImagesResponses[1];
              this.sliderImagePath.push(secImage);
            }
            if (this.fullCmReportList.systemImagesResponses[2]) {
              const thirdImage = this.fullCmReportList.systemImagesResponses[2];
              this.sliderImagePath.push(thirdImage);
            }
          }

          if (this.fullCmReportList.systemVideoResponses) {
            if (this.fullCmReportList.systemVideoResponses[0]) {
              this.sliderVideoPath = [this.fullCmReportList.systemVideoResponses[0]]
            }
          }



          this.pdfReportUrl = this.locationPath;

          this.getMessage();
        }

        if (this.fullCmReportList) {
          this.notEmpty = true;
          this.emptyData = false
        } else {
          this.notEmpty = false;
          this.emptyData = true
        }
      }
      this.SpinnerService.hide();
    }, error => {

    })
  }

  reportOfColor(readingId: number) {

    this.readingId = readingId;
    console.log(this.fullCmReportList);


    this.sliderImagePath = [];
    this.sliderVideoPath = null;
    this.getFullCmReportData(this.readingId, this.compDetailId);
    window.scrollTo(0, 0);
    // }
  }

  elementType = 'url';


  windowScroll() {
    window.scrollTo(0, 0);
  }

  getMessage() {
    const id = Number(this.compDetailId ? this.compDetailId : 0);
    this.messageServices.getMessages({ companyDetailId: id, messageId: 0, page: 0, limit: 0, orderBy: "CreatedOn", orderByDescending: true, allRecords: true }).subscribe(res => {
      this.messagesList = res.messageResponseList;
      if (this.messagesList && this.messagesList.length > 0) {
        this.notFound = false;
      } else {
        this.notFound = true;
      }
    })
  }

  params = {
    messageFromId: 0,
    messageTitle: "string",
    messageDescription: "",
    messageDate: "2020-06-16T13:53:56.337Z",
    companyId: 0,
    companyDetailId: 0,
    messageId: 0,
    images: "string",
    imagesType: "string",
    actionBy: "string"
  }

  editMsgData: any;
  editMessage(object: any) {
    const tempDate = moment().format();
    this.isImageSaved = true;
    this.msgInputTxt = object.messageDescription;
    this.cardImageBase64 = this.api + object.imagesResponse.imageUrl;
    this.params.messageFromId = this.userId;
    this.params.companyId = Number(this.companyId ? this.companyId : 0);
    this.params.companyDetailId = Number(this.compDetailId ? this.compDetailId : 0);
    this.params.messageId = object.messageId;
    this.params.messageDate = tempDate;
    this.editMsgData = this.params;
    this.imageType = String(object.imagesResponse.imageType)
    this.imageUrl = object.imagesResponse.imageUrl
  }
  addMessage() {
    this.SpinnerService.show();
    if (this.params.messageId > 0) {
      this.updateMessage();
    }
    const tempDate = moment().format()
    this.params.messageDescription = this.msgInputTxt;
    this.params.messageFromId = this.userId;
    this.params.companyId = Number(this.companyId ? this.companyId : 0);
    this.params.companyDetailId = Number(this.compDetailId ? this.compDetailId : 0);
    this.params.images = this.imageUrl;
    this.params.imagesType = this.imageType;
    this.params.messageDate = tempDate;
    this.messageServices.addMessages(this.params).subscribe(res => {
      this.msgInputTxt = '';
      this.isImageSaved = false;
      this.notFound = false;
      this.imageType = "";
      this.imageUrl = "";
      this.getMessage();
      this.toastr.success('', res.message, {
        timeOut: 2000
      });
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.SpinnerService.hide();
      }, 500);
    })
  }

  updateMessage() {
    this.SpinnerService.show();
    this.params.messageDescription = this.msgInputTxt;
    this.params.images = this.imageUrl;
    this.params.imagesType = this.imageType;

    this.messageServices.addMessages(this.editMsgData).subscribe(res => {

      this.msgInputTxt = '';
      this.isImageSaved = false;
      this.notFound = false;
      this.imageType = "";
      this.imageUrl = "";
      this.params.messageId = 0;
      this.getMessage();
      this.toastr.success('', res.message, {
        timeOut: 2000
      });
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.SpinnerService.hide();
      }, 500);
    })
  }

  deleteMessage(id: number) {
    let confirmation = confirm('Do you want to delete this Message?');
    if (confirmation) {
      this.messageServices.deleteMessages({ messageId: id }).subscribe(res => {
        if (this.messagesList && this.messagesList.length > 0) {
          this.notFound = false;
        } else {
          this.notFound = true;
        }
        this.getMessage();
        this.toastr.success('Successfully', 'Message Delete', {
          timeOut: 2000
        });
      })
    }

  }

  fileChangeEvent(fileInput: any) {
    this.imageError = "";
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      const file = fileInput.target.files[0];
      reader.readAsDataURL(file);
      this.imageType = file.type.split('/')[1];

      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        this.imageUrl = String(reader.result).split(',')[1];
      }


    }

  }

  // Get Image Url

  public getImgUrl(url: string, index: number) {
    this.indexNum = index;
    this.imgUrl = url;
    this.showModal = true;
    this.overlay = true;
  }

  hideModal() {
    this.showModal = false;
    this.overlay = false;
  }



  print(): void {
    //window.print();
    let printContents, popupWin, printbutton, onlyForPrinting1, onlyForPrinting2, onlyForPage1, onlyForPage2;

    // Syscraft comment
    // onlyForPrinting1 = document.getElementById('onlyForPrinting1').style.display = "block";
    // onlyForPrinting2 = document.getElementById('onlyForPrinting2').style.display = "block";
    // onlyForPage1 = document.getElementById('onlyForPage1').style.display = "none";
    // onlyForPage2 = document.getElementById('onlyForPage2').style.display = "none";
    // printbutton = document.getElementById('inputprintbutton').style.display = "none";
    // printContents = document.getElementById('printDiv').innerHTML;

    onlyForPrinting1 = document.getElementById('onlyForPrinting1')!.style.display = "block";
    onlyForPrinting2 = document.getElementById('onlyForPrinting2')!.style.display = "block";
    onlyForPage1 = document.getElementById('onlyForPage1')!.style.display = "none";
    onlyForPage2 = document.getElementById('onlyForPage2')!.style.display = "none";
    printbutton = document.getElementById('inputprintbutton')!.style.display = "none";
    printContents = document.getElementById('printDiv')!.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    // Syscraft comment
    // popupWin!.document.open();
    // popupWin!.document.write(`
    popupWin!.document.open();
    popupWin!.document.write(`
    <html>
    <head>

      <title>Print tab</title>
      <style media="print">

      * {
        -webkit-print-color-adjust: exact; /*Chrome, Safari */
        color-adjust: exact;  /*Firefox*/
        box-sizing: border-box;
        font-family: Roboto, "Helvetica Neue", sans-serif;
        }
        .pagebreak {page-break-after: always;}
        .card
        {
          width:100%;
          float:left;
        }
        .card-header {
          margin: 0 0 20px 0;
      }
      .row::after {
        content: "";
        clear: both;
        display: table;
      }
      .graph-image{
        width:100%;
        overflow:hidden;
      }
      .graph-image img{
        width:100%;
        max-width:100%;
      }
      .thumbImageNew{
         width:33.33%;
         float:left;
         padding: 5px;
        //  margin:0 0 20px 0;
      }
      .thumbImageNew img {
          max-width: 100%;
          width: 100%;
          height:150px;
          object-fit: cover;
      }
      .thumbVideo{
        width:100%;
        dislay: flex;
        margin: auto;
        justify-content: center;
        padding: 5px;
     }
     .thumbVideo video {
      max-width: 100%;
      width: 100%;
      height:250px;
  }
  .table{
    border: 1px solid #dee2e6;
    border-bottom: none;
    width:100%;
   }
   .haaTable.table{
    border: 1px solid #dee2e6;
    border-bottom: 1px solid #dee2e6;
    padding-bottom:15px;
   }
  .table > thead > tr{
   background-color:#f9f9f9;
  }
  .table > thead > tr > th{
    color:#000;
    padding:6px 2px;
    font-size:14px;
    font-family: Roboto, "Helvetica Neue", sans-serif;
    border-right:1px solid #dee2e6;
    border-bottom:1px solid #dee2e6;
    white-space: nowrap;
   }
   .table  > thead > tr > th:last-child{
     border-right:none;
   }
   .table  > tbody > tr > td{
    padding:6px 2px;
    font-size:12px;
    vertical-align:middle;
    text-align:center;
    font-family: Roboto, "Helvetica Neue", sans-serif;
    font-weight:400;
    border-right:1px solid #dee2e6;
    border-bottom:1px solid #dee2e6;
    text-align: left;
   }
   .table  > tbody > tr > td:last-child{
      border-right:none;
   }
   .card-header{
    margin:20px 0 0;
    font-family: Roboto, "Helvetica Neue", sans-serif;
    border-bottom: none !important;
    background-color: #181824 !important;
    color: #fff !important;
    font-size: 14px;
    padding: 0.5rem 1.25rem;
   }
  .card-body form{
      border:1px solid #dee2e6;
      padding:15px;
      margin-bottom:20px;
   }
   .table  > tbody > tr:nth-child(even) {
    background: #fbfbfb;
   }
   .table  > tbody > tr:nth-of-type(odd) {
  background-color: #FFF;
  }
  .apexcharts-toolbar{
    display: none !important;
  }
  .apexcharts-tooltip.apexcharts-theme-light.apexcharts-active {
        display: none !important;
        opacity:0 !important;
    }
    .apexcharts-tooltip.apexcharts-theme-light {
      display: none !important;
      opacity:0 !important;
  }
  .apexcharts-xaxistooltip.apexcharts-xaxistooltip-bottom.apexcharts-theme-light{
    display: none !important;
      opacity:0 !important;
  }

  .graph-image img{
    // height: 350px;
    width: 100%;
    width: auto !important;
    margin: auto;
    display: flex;
  }
  .text-center{
    text-align: center;
  }

  #onlyForPrinting1, #onlyForPrinting2{
    position: relative;
    width: 50%;
    display: inline-block;
    float:left;
  }
  #onlyForPrinting1{
    padding-right:12px;
  }
 #onlyForPrinting2{
  padding-left:12px;
  }
  #onlyForPrinting1 .card .card-header,#onlyForPrinting2 .card .card-header {
    border-bottom: none ;
    background-color: #181824 ;
    color: #fff;
    font-size: 14px;
    padding:5px 15px 0 15px;
    margin-top:-10px;
    margin-left:-10px;
    width:516px;
  }
  #onlyForPage2 .grayBg, #onlyForPage1 .grayBg {
    margin:15px !important;
    margin-bottom: 0px !important;
  }
  #onlyForPrinting1 .card,#onlyForPrinting2 .card{
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 14%);
    // margin-bottom: 20px;
    height: 220px ;
    padding:10px;
    overflow:hidden;
  }
  .tablePanel tbody tr td {
    height: 40px;
  }
  #onlyForPrinting1 .thumbImageNew img {
    object-fit: contain;
    height:150px;
  }
  #onlyForPrinting1 .thumbVideo video {
    height:130px;
  }
  .haaTable.table tr th{
    font-size:11px;
   }

      </style>
    </head>
<body onload="window.print();window.close()">${printContents}</body>
  </html>`
    );

    // Syscraft comment
    // onlyForPrinting1 = document.getElementById('onlyForPrinting1').style.display = "none";
    // onlyForPrinting2 = document.getElementById('onlyForPrinting2').style.display = "none";
    // onlyForPage1 = document.getElementById('onlyForPage1').style.display = "block";
    // onlyForPage2 = document.getElementById('onlyForPage2').style.display = "block";
    // printbutton = document.getElementById('inputprintbutton').style.display = "block";
    // popupWin.document.close();

    onlyForPrinting1 = document.getElementById('onlyForPrinting1')!.style.display = "none";
    onlyForPrinting2 = document.getElementById('onlyForPrinting2')!.style.display = "none";
    onlyForPage1 = document.getElementById('onlyForPage1')!.style.display = "block";
    onlyForPage2 = document.getElementById('onlyForPage2')!.style.display = "block";
    printbutton = document.getElementById('inputprintbutton')!.style.display = "block";
    popupWin!.document.close();

  }


  QRcodebutton() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "pdfReportUrl": this.pdfReportUrl,
        "companyNo": this.companyNo,
        "assetId": this.assetId,
      }
    };
    this.router.navigate(["/admin/qr-code"], navigationExtras)
  }

}
