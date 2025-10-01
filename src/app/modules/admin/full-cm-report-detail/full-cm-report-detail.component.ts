import { Component, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { BaseUrl } from '../../../config/url-config';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  colors: string[];
};

@Component({
  selector: 'app-full-cm-report-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxSpinnerModule, NgApexchartsModule],
  templateUrl: './full-cm-report-detail.component.html',
  styleUrl: './full-cm-report-detail.component.scss'
})
export class FullCmReportDetailComponent {
  // Syscraft comment
  // @ViewChild("chart") chart: ChartComponent;
  
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  api = BaseUrl.imgUrl;
  api2 = BaseUrl.apiUrl;
  foundData: boolean = false;
  notFoundData: boolean = true;
  foundDataSummary: boolean = false;
  notfoundDataSummary: boolean = true;

  datacheck: number = 0;
  constructor(
    private globalService: GlobalCodeService,
    private route: ActivatedRoute,
    private SpinnerService: NgxSpinnerService
  ) {
    //Line chartOptions
    this.chartOptions = {

      chart: {
        height: 350,
        type: "line",
        // width: 300
      },
      colors: ['#4FA845', '#FFC234', '#DC4146'],

      stroke: {
        width: 5,
        curve: "straight",
        colors: ['#4FA845', '#FFC234', '#DC4146']
      },

      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        },
        colors: ['#4FA845', '#FFC234', '#DC4146']
      },

      grid: {
        borderColor: "#f1f1f1"
      },
      xaxis: {
        labels: {
          rotate: -90,
        }
      }
    };
  }

  printClass: boolean = false;
  companyId: number = 0;
  inputDate: any;
  companyReportDetailId: number = 0;
  ReportDetails: any[] = [];
  SummaryDetails: any;
  ListAreaOfPlant: any;
  ReportDetailsJsonString: any;
  headinggName: any = [];

  // Syscraft comment
  // engineerName: string;
  // collectedBy: string;
  engineerName!: string;
  collectedBy!: string;
  print: boolean = false;

  dashboardGraphData: any[] = [];
  dashboardGraphCategories: any;
  redDashValue: any[] = [];
  yellowDashValue: any[] = [];
  greenDashValue: any[] = [];
  percOfAcceptable: any = 0;
  percOfWarning: any = 0;
  percOfCaution: any = 0;

  // Syscraft comment
  // totalAcceptable: number;
  // totalCaution: number;
  // totalWarning: number;
  // lastWarning: number;
  // lastCaution: number;
  // lastAcceptable: number;

  totalAcceptable!: number;
  totalCaution!: number;
  totalWarning!: number;
  lastWarning!: number;
  lastCaution!: number;
  lastAcceptable!: number;

  headingStore: any;
  summaryDetailHeadings: any;
  summaryDetailData: any;

  greenValue: any[] = [];
  redValue: any[] = [];
  warningValue: any[] = [];
  dateValue: any[] = [];

  lastTwelveMonthGraphData: any[] = [];
  dashboardGraphValues: any[] = [];
  AllGraphValues: any[] = [];
  categories: any;
  date: any;

  // Syscraft comment
  // reportedDateValue: string;
  // companyName: string;
  reportedDateValue!: string;
  companyName!: string;
  graphDisable: boolean = false;

  historicalAlarms: any[] = [];
  sytemResponseImages: any[] = [];
  sytemResponseVideos: any[] = [];

  ngOnInit(): void {

    this.route.queryParams.subscribe((parms: any) => {
      this.companyId = parms.companyId;
      // console.log('this.companyId', this.companyId);
      this.inputDate = parms.reportDate;
      this.engineerName = parms.engineerName;
      this.printClass = parms.printClass;
      this.companyReportDetailId = parms.companyReportDetailId;
      // console.log('companyReportDetailId', this.companyReportDetailId);
      this.collectedBy = parms.collectedBy;
      this.print = parms.print;
      // this.reportDateWithMonth = parms.reportDateWithMonth
    })

    this.getFullCmReportDetail(this.companyId);
    this.getDashboardGraphValue(this.companyId);

  }

  getDashboardGraphValue(companyId: number) {
    const id = Number(companyId ? companyId : 0);
    this.globalService.companyDashboardForLastTwelveMonths({ companyId: id, requestDate: "2020-06-30T16:09:06.291Z" }).subscribe(res => {
      const resData = JSON.parse(res.dashboardStatusGraphResponse);
      // console.log('Inside getDashboardGraphValue resData', resData);
      if (resData) {
        if (resData.length == 0) {
          return;
        }
        const lastTwelveMonthData = JSON.parse(resData[0].JSONSTRING);
        for (let i = 0; i < lastTwelveMonthData.length; i++) {
          this.lastAcceptable = lastTwelveMonthData[i].Green;
          this.lastWarning = lastTwelveMonthData[i].Red;
          this.lastCaution = lastTwelveMonthData[i].Yellow
        }
        if (lastTwelveMonthData) {
          lastTwelveMonthData.map((data: any) => {
            const totalNumber = Number(this.lastAcceptable) + Number(this.lastCaution) + Number(this.lastWarning);
            this.percOfAcceptable = (this.lastAcceptable / totalNumber * 100).toFixed(2);
            this.percOfWarning = (this.lastWarning / totalNumber * 100).toFixed(2);
            this.percOfCaution = (this.lastCaution / totalNumber * 100).toFixed(2);
            return data;
          })
          const greenValues = lastTwelveMonthData.map((data: any) => data.Green);
          const redValues = lastTwelveMonthData.map((data: any) => data.Red);
          const yellowValues = lastTwelveMonthData.map((data: any) => data.Yellow);
          const dateValue = lastTwelveMonthData.map((data: any) => moment(data.ReportDate).format('DD/MM/yyyy'));
          this.dashboardGraphCategories = {
            labels: {
              rotate: -75,
              style: {
                fontSize: "10px",
                fontFamily: "Helvetica, Arial, sans-serif",
              }
            },
            categories: dateValue
          }

          this.dashboardGraphData = [{
            name: "Acceptable",
            data: greenValues
          }, {
            name: "Caution",
            data: yellowValues
          }, {
            name: "Warning",
            data: redValues
          }];
        }
      }

    })
  }

  getFullCmReportDetail(companyId: number) {
    // console.log('Inside getFullCmReportDetail', companyId);
    if (this.companyReportDetailId == 0 || this.companyReportDetailId == undefined) {
      this.companyReportDetailId = -1;
    }
    this.SpinnerService.show();
    const id = Number(companyId ? companyId : 0);
    const compReportDetailId = Number(this.companyReportDetailId ? this.companyReportDetailId : 0);
    this.globalService.getFullCMReportDetail({ CompanyId: id, InputDate: this.inputDate, companyReportDetailId: compReportDetailId, page: 0, limit: 0, orderBy: "CreatedOn", orderByDescending: true, allRecords: true }).subscribe((res: any) => {
      const resData = JSON.parse(res.fullCmReportDetails);
      // console.log('resData response', resData);

      if (resData) {
        this.ReportDetails = JSON.parse(resData[0].DetailReport);
        // console.log('Inside if this.ReportDetails', this.ReportDetails);
      }
      if (this.ReportDetails) {
        const reportData = this.ReportDetails.map(data => {
          this.companyName = data.CompanyName;
          this.reportedDateValue = data.DateValue;
          return data;
        });

        this.ReportDetails.forEach((sytemImages: any) => {
          // console.log('sytemImages', sytemImages);
          const images = sytemImages.SystemImagesResponse != 'NoData' ? JSON.parse(sytemImages.SystemImagesResponse) : null;
          // Syscraft added
          // const alarmColors = sytemImages.AlarmHistory != '' ? JSON.parse(sytemImages.AlarmHistory) : '';
          const alarmColors = sytemImages.AlarmHistory != 'NoData' ? JSON.parse(sytemImages.AlarmHistory) : '';
          if (images) this.sytemResponseImages.push({ images: images, companyDetailId: sytemImages.CompanyDetailId });
          if (alarmColors) this.historicalAlarms.push({ color: alarmColors, companyDetailId: sytemImages.CompanyDetailId })
        });

        for (let i = 0; i < this.ReportDetails.length; i++) {
          const videos = this.ReportDetails[i].SystemVideoResponses != 'Nodata' ? JSON.parse(this.ReportDetails[i].SystemVideoResponses) : [];
          if (this.sytemResponseImages[i]) {
            this.sytemResponseImages[i].images.unshift({ IMageUrl: this.ReportDetails[i].AssestImage }),
              this.sytemResponseImages[i].companyDetailId = this.ReportDetails[i].CompanyDetailId
          } else {
            this.sytemResponseImages[i] = {
              images: [{ IMageUrl: this.ReportDetails[i].AssestImage }],
              companyDetailId: this.ReportDetails[i].CompanyDetailId
            }
          }
          if (this.sytemResponseVideos[i]) {
            this.sytemResponseVideos[i].videos = videos,
              this.sytemResponseVideos[i].companyDetailId = this.ReportDetails[i].CompanyDetailId
          } else {
            this.sytemResponseVideos[i] = {
              videos: videos,
              companyDetailId: this.ReportDetails[i].CompanyDetailId
            }
          }
        }

        this.foundData = true;
        this.notFoundData = false;

      } else {
        setTimeout(() => {
          /** spinner ends after 2 seconds */
          this.SpinnerService.hide();
        }, 500);
        this.foundData = false;
        this.notFoundData = true;
      }

      if (resData) {
        this.summaryDetailData = JSON.parse(resData[0].SummaryReport);
        // console.log('this.summaryDetailData1', this.summaryDetailData);
        this.SummaryDetails = JSON.parse(resData[0].SummaryReport);
      }

      if (this.SummaryDetails) {
        this.foundDataSummary = true;
        this.notfoundDataSummary = false;
        this.headingStore = this.SummaryDetails.map((data: any) => {
          // console.log('SummaryDetails data', data);
          data.CompanyDetailId;
          this.summaryDetailHeadings = data;
          this.summaryDetailHeadings.CompanyNo;
          this.summaryDetailHeadings.CompanyArea;
          this.summaryDetailHeadings.AssetId;
          this.summaryDetailHeadings.SapNo;
          return data;
        })

      } else {
        this.foundDataSummary = false;
        this.notfoundDataSummary = true;
      }

      setTimeout(() => {
        this.SpinnerService.hide();

        if (this.print) {
          this.printFun();
        }
      }, 1000);

    }, error => {
      setTimeout(() => {
        this.SpinnerService.hide();
      }, 500);

    })

  }
  returnZero() {
    return 0
  }

  // Syscraft comment
  // imgUrl: string;
  // showModal: boolean;
  // indexNum: number;
  // overlay: boolean;

  imgUrl!: string;
  showModal!: boolean;
  indexNum!: number;
  overlay!: boolean;
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

  printFun() {
    let printContents, popupWin, printbutton, displayonprint, machineAlarmPage, machineAlarmPrint, assetHistoryPage, assetHistoryPrint, dashbordGraphOnPage, dashbordGraphOnPrint;

    // Syscraft comment 
    // machineAlarmPage = document.getElementById('machineAlarmPage').style.display = "none";
    // machineAlarmPrint = document.getElementById('machineAlarmPrint').style.display = "block";
    // assetHistoryPage = document.getElementById('assetHistoryPage').style.display = "none";
    // assetHistoryPrint = document.getElementById('assetHistoryPrint').style.display = "block";
    // printbutton = document.getElementById('inputprintbutton').style.display = "none";
    // printContents = document.getElementById('printDiv').innerHTML;

    machineAlarmPage = document.getElementById('machineAlarmPage')!.style.display = "none";
    machineAlarmPrint = document.getElementById('machineAlarmPrint')!.style.display = "block";
    assetHistoryPage = document.getElementById('assetHistoryPage')!.style.display = "none";
    assetHistoryPrint = document.getElementById('assetHistoryPrint')!.style.display = "block";
    printbutton = document.getElementById('inputprintbutton')!.style.display = "none";
    printContents = document.getElementById('printDiv')!.innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');

    // Syscraft comment
    // popupWin.document.open();
    // popupWin.document.write(`

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
            font-size: 25px;

            }

            .pagebreak {page-break-after: always;}
            .machineAlarmPageData{
              position:relative;
              top: 50% !important;
            }

            #apexchartsgnzscya2 svg{
              width: 900px !important;
            }

            //.pagebreakBefore {page-break-before: always;}
            .ShowHideLogo
            {
              margin-bottom: 10px;
            }
            .hrHide{
              display:none!important;
            }
            .logo-text{
              margin-top: 50px;
            }
            .logo-desc{
              // margin-top: 250px;
              margin-top: 20px;
            }
            .pagebreakMargin{
              padding-top: 500px !important;
              display:block !important;
            }
            .card
            {
              width:100%;
              float:left;
              font-size: 25px;
            }
            .card-header {
              margin: 0 0 20px 0;
          }
          .card-body{
            border:1px solid #eee;
            padding: 10px;
           
          }
          .row::after {
            content: "";
            clear: both;
            display: table;
          }
          .thumbImageNew{
             width:25%;
             float:left;
             padding: 5px;
            //  margin:0 0 20px 0;
          }          
          .thumbImageNew img {
              max-width: 100%;
              width: 100%;
              height:110px;
              object-fit: cover;
          }
          .thumbVideo{
            width:25%;
            float:left;
            padding: 5px;
         }
         .thumbVideo video {
          max-width: 100%;
          width: 100%;
          height:110px;
      }
      .graphImage{
        margin-bottom: 10px;
      }
      .detailText h3 {
        margin: 0;
      }
      .detailText p {
        margin: 10px 0;
        font-size: 12px;
      }
      #onlyForPage1,#onlyForPage2{
        flex: 0 0 50%;
        max-width: 50%;
        position: relative;
        width: 100%;
        padding-right: 15px;
        padding-left: 15px;
        word-wrap: break-word;
        float: left;
        margin-top:10px;
      }
      #onlyForPage1 .card .card-header,#onlyForPage2 .card .card-header {
        border-bottom: none !important;
        background-color: #181824 !important;
        color: #fff !important;
        font-size: 14px;
        margin: 0;
    }
      #onlyForPage1 .card-body.grayBg,#onlyForPage2 .card-body.grayBg {
        margin: 0;
        min-height:260px;
      }
      
      .table{
        border-top: 1px solid #dee2e6;
        width:100%;
        padding:0 !important; 
        margin:0 !important;
       }
      .table > thead > tr{
       background-color:#000;
       border: 1px solid #000 !important; 
      }
      .table > tbody > tr{
        border: none !important; 
       }
       .table > tbody > tr td:first-child{
        border-left: 1px solid #000 !important; 
       }
       .table {
        border-top: 1px solid #000 !important; 
       }
      .table > thead > tr > th{
        color:#fff;  padding:2px;
        font-size:22px !important;    
        font-family: Roboto, "Helvetica Neue", sans-serif; 
        border: none !important;
       }
       .table  > tbody > tr > td{
        padding:6px 2px;
        font-size:21px !important;
        vertical-align:middle;
        font-family: Roboto, "Helvetica Neue", sans-serif;
        font-weight:400;
        border-bottom: 1px solid #000 !important;
        border-right: 1px solid #000 !important; 
       }
      .printFunCol ul li {
        margin: 0px !important;
      }
      #tabledatafs > thead > tr > th{
        font-size: 18px !important;
      }
      #tabledatafs > tbody > tr > td{
        font-size: 17px !important;
      }
       .card-header{
         background-color: #000;
         color: #ffff;
         padding:10px;
        margin:20px 0;
        font-family: Roboto, "Helvetica Neue", sans-serif;
        font-size: 25px;
       }
       
       .table  > tbody > tr:nth-child(even) {
        background: #f5f5f5;
       }
       .table  > tbody > tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.05);
        }
        .table p{
          padding: 10px;
        }
        .graphImage{
          height: 300px;
        }
        .graphImage img{
          width: 100% !important;
          height: 300px;
          margin-top: 10px;
        }
        .graphImageNotShow{
            position: relative;
            text-align: center;
            top: 150px;
          }
          apx-chart{
            text-align: center;
            display: inline !important;
            width: 80% !important;
          }

      hr{
        margin-top: 2rem !important;
        margin-bottom: 2rem!important;
      }
      apx-chart{
        width: 100%;
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
      .logo{
        padding-bottom: 0 !important;
      }
      .text-center{
        text-align: center;
        padding-bottom : 40px
      }
      .graph-image img{
        width: 100%;
      }
      .print-width{
        width: 350px !important;
      }
      h2{
        font-size:35px !important;
      }
      h3{
        font-size:33px !important;
      }
      h4{
        font-size:30px !important;
      }
      p{
        font-size:26px !important;
      }
      .card-header {
        font-size: 26px !important;
        font-weight:bold !important;
    }
      .printFunRow{
        display:flex; 
        flex-direction:row;
        width:100%;
        justify-content:space-arround;  
        // border-bottom: 1px solid #ccc;
        // padding-bottom:20px;
        // margin-bottom:20px;
      }
      // .row h1 ,.row h2 ,.row h3,.row h4{
      //   font-size:25px;
      // }
      
      tspan {
        font-size: 10px !important;
      }

      .graphs {
        width: 70%;
      }
    .heading-center{
      display:flex;
      justify-content:center;
      align-items:center;
      height:65%;
    }
    .center-top-graph
    {
      // position: relative;
      // margin-top: 30% !important;
      // top: 50% !important;
      
    }

    .apexcharts-legend-series {
      margin: 2px 10px !important;
    }
    .plantAssetGraph .col-sm-10 {
      flex: 0 0 100%;
      max-width: 100%;
      display: flex;
      width: 100%;
      padding: 0px !important;
      padding-left: 0px !important;
      padding-right: 0px !important;
      margin: 0px !important
    }
   
    .plantAssetGraph .col-sm-2 {
      flex: 0 0 100%;
      max-width: 100%;
      display: flex;
      width: 100%;
    }
    .Status-icon{
      position: relative;
      top: 30px;
      display: flex;
      justify-content: space-around;
      width: 100%;
  }
      #apexchartswig3eirdi ,svg#SvgjsSvg3641 ,foreignObject{
          width: 1000px !important;
      }
      #chart div{
        width: 1000px !important;
      }
      #chart .apexcharts-legend.apexcharts-align-center.position-bottom div{
        width: auto !important;
        margin: 0 !important;
        padding: 0 !important;
      }
    
      .topIcons img{
        margin-top: 10px !important;
      }
      .topIcons p {
        margin:0px !important;
      }

      #historyTable th * {
        font-size:10px !important;
      }
      #historyTable td *  {
        font-size:11px !important;
      }
      #historyTable>thead>tr>th:nth-child(2){
        white-space: nowrap;
      }
      #historyTable>thead>tr>th:first-child {
        display: none;
      }
      #historyTable>tbody>tr>td:first-child {
          display: none;
      }
      #historyTable>tbody>tr>td:nth-child(4){
        min-width: 200px;
      }
      #historyTable>thead>tr>th:nth-child(5),#historyTable>thead>tr>th:nth-child(6),#historyTable>thead>tr>th:nth-child(7),#historyTable>thead>tr>th:nth-child(8),
      #historyTable>thead>tr>th:nth-child(9),#historyTable>thead>tr>th:nth-child(10),#historyTable>thead>tr>th:nth-child(11),#historyTable>thead>tr>th:nth-child(12){
        width: 40px !important;
        max-width: 40px !important;
      }
      #historyTable>tbody>tr>td{
        height:auto:
        min-height:inherit;
        padding:2px;
      }

      .systemAssetImages{
        display: flex;
        // justify-content: center;
        align-items: center;
      }
      .assetImages {
        display: inline-flex;
      }
      img.imgHeight {
        min-height: 150px;
        max-width: 150px;
        height: auto;
        min-height: 150px;
        padding: 5px;
      }
      #onlyForPage1 .card,#onlyForPage2 .card{
        margin: 0;
        min-height:250px;
      }

          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );

    // Syscraft comment
    // machineAlarmPage = document.getElementById('machineAlarmPage').style.display = "block";
    // machineAlarmPrint = document.getElementById('machineAlarmPrint').style.display = "none";
    // assetHistoryPage = document.getElementById('assetHistoryPage').style.display = "block";
    // assetHistoryPrint = document.getElementById('assetHistoryPrint').style.display = "none";
    // printbutton = document.getElementById('inputprintbutton').style.display = "inline-block";

    // popupWin.document.close();

    machineAlarmPage = document.getElementById('machineAlarmPage')!.style.display = "block";
    machineAlarmPrint = document.getElementById('machineAlarmPrint')!.style.display = "none";
    assetHistoryPage = document.getElementById('assetHistoryPage')!.style.display = "block";
    assetHistoryPrint = document.getElementById('assetHistoryPrint')!.style.display = "none";
    printbutton = document.getElementById('inputprintbutton')!.style.display = "inline-block";

    popupWin!.document.close();
    this.SpinnerService.hide();



  }

}
