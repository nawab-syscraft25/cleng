import { Component, ViewChild } from '@angular/core';
import moment from 'moment';
import { ApexAnnotations, ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexMarkers, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { CommonModule } from '@angular/common';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type BarChart = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: any; //ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
};

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
};

@Component({
  selector: 'app-prescriptive-maintenance',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './prescriptive-maintenance.component.html',
  styleUrl: './prescriptive-maintenance.component.scss'
})
export class PrescriptiveMaintenanceComponent {
  // Syscraft comment
  // @ViewChild("pieChart") pieChart: ChartComponent;
  // @ViewChild("barChart") barChart: ChartComponent;
  // @ViewChild("chart") chart: ChartComponent;
  @ViewChild("pieChart") pieChart!: ChartComponent;
  @ViewChild("barChart") barChart!: ChartComponent;
  @ViewChild("chart") chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public PieChartOptions: Partial<PieChartOptions>;
  public BarChart: Partial<BarChart>;

  prescriptiveMaintenanceList: any;
  PrescriptiveMaintenanceYealyData: any = [];
  showPieChart: boolean = true;
  showBarChart: boolean = false;
  pieBtnHighlight: boolean = true;
  barBtnHighlight: boolean = false;
  monthlyChart: boolean = true;
  yearlyChart: boolean = false;
  monthlyText: boolean = false;
  yearlyText: boolean = true;
  chartButtons: boolean = true;
  monthBtnHighlight: boolean = true;
  yearBtnHighlight: boolean = false;


  date = moment().format();
  allFaultType: any[] = [];

  headingData: any;
  headingStore: any;
  yearGraphData: any[] = [];
  storeKey: any[] = [];
  graphCategoryStore: any[] = [];
  category: any;
  objectData: any;
  storeKey2: any[] = [];
  newArray: any;
  storeArr = [];
  constructor(
    private globalCodeService: GlobalCodeService,
    private localStorageService: LocalStorageService
  ) {

    //Pie chartOptions
    this.PieChartOptions = {
      chart: {
        width: 320,
        type: "pie"
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 320,
            },
            legend: {
              position: "top"
            }
          }
        }
      ]
    };

    //Bar chartOptions
    this.BarChart = {

      annotations: {
        points: [
          {
            seriesIndex: 0,
            label: {
              borderColor: "#775DD0",
              offsetY: 0,
              style: {
                color: "#fff",
                background: "#775DD0"
              },
            }
          }
        ]
      },
      chart: {
        height: 270,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          // endingShape: 'rounded',
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: ["#fff", "#f2f2f2"]
        }
      },
      yaxis: {
        title: {
          // text: "Servings"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    };

    //Line chartOptions
    this.chartOptions = {
      chart: {
        height: 300,
        type: "line"
      },

      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },


      grid: {
        borderColor: "#f1f1f1"
      }
    };

  }

  // Syscraft comment
  // companyId: number;
  // companyName: string;
  companyId!: number;
  companyName!: string;
  userId: number = 0;
  ngOnInit(): void {
    const user = this.localStorageService.getUserCredentials();
    this.userId = user.userId;
    const compId = this.localStorageService.getCompanyId();
    if (compId.companyId == "") {
      this.companyId = 0;
    } else {
      this.companyId = compId.companyId;
      this.companyName = compId.companyName;
    }
    this.getPrescriptiveFaultMonthData();
    this.getYearlyChartData();

  }


  getPrescriptiveFaultMonthData() {
    const id = Number(this.companyId ? this.companyId : 0);
    this.globalCodeService.getPrescriptiveMaintenance({ fromDateTime: this.date, UserId: this.userId, companyId: id }).subscribe(res => {
      if (!res?.faultRecordsResponse) return;

      const data = res?.faultRecordsResponse[0];
      if (data) {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            this.allFaultType.push(key);
          }
        }
      }

      this.allFaultType.forEach(element => {
        const index = this.allFaultType.findIndex(f => (f == "FaultYear" || f == "FaultMonth"));
        if (index > -1) this.allFaultType.splice(index, 1);
      });

      this.prescriptiveMaintenanceList = res.faultRecordsResponse.map((data: any) => {
        const chartData = this.allFaultType.map(value => {
          return Number(data[value])
        })

        const chartLables = [];
        for (var i = 0; i < this.allFaultType.length; i++) {
          const splitData = this.allFaultType[i].split('/');
          chartLables.push(splitData[0]);
        }
        data.lables = chartLables;
        data.chartData = chartData;

        data.xaxis = {
          labels: {
            rotate: -45
          },
          categories: chartLables
        }
        data.barChartData = [{
          name: "Reading",
          data: chartData
        }]

        return data;
      });

    })
  }


  getYearlyChartData() {
    const id = Number(this.companyId ? this.companyId : 0);
    this.globalCodeService.getFaultCountForLastMonths({ fromDateTime: this.date, UserId: this.userId, companyId: id }).subscribe(res => {
      const resData = JSON.parse(res.faultCountForLastMonths);
      if (resData) {
        this.objectData = resData[0].JSONSTRING;
      }

      const yearData = JSON.parse(this.objectData);
      const headings = JSON.parse(this.objectData);
      this.headingStore = headings.map((value: any) => {
        this.headingData = value;
        return value;
      });

      for (let obj of this.headingStore) {
        for (let key in obj) {
          this.storeKey.push(key)
        }
      }
      for (let i = 0; i < this.storeKey.length; i++) {
        if (this.storeKey[i] != "FaultType") {
          this.storeKey2.push(this.storeKey[i]);
        }
      }
      this.newArray = [...new Set(this.storeKey2)];

      this.PrescriptiveMaintenanceYealyData = yearData.map((data: any) => {
        let chartData: any = [];
        this.newArray.forEach((element: any, index: any) => {
          chartData.push(Number(data[this.newArray[index]]));
        });

        data.yearChatData = {
          name: data.FaultType,
          data: chartData
        };
        this.graphCategoryStore = this.newArray;
        this.category = { categories: this.graphCategoryStore }

        this.yearGraphData.push(data.yearChatData);
        return data;
      });

    })
  }

  returnZero() {
    return 0
  }

  pieChartBtn() {
    this.showPieChart = true;
    this.showBarChart = false;
    this.barBtnHighlight = false;
    this.pieBtnHighlight = true;
  }

  barChartBtn() {
    this.showPieChart = false;
    this.showBarChart = true;
    this.barBtnHighlight = true;
    this.pieBtnHighlight = false;

  }

  yearly() {
    this.yearlyChart = true;
    this.monthlyChart = false;
    this.yearlyText = false;
    this.monthlyText = true;
    // this.barBtnHighlight = true;
    this.yearBtnHighlight = true;
    this.monthBtnHighlight = false;
    // this.pieBtnHighlight = false;
    this.chartButtons = false;
  }
  monthly() {
    this.yearlyChart = false;
    this.monthlyChart = true;
    this.yearlyText = true;
    this.monthlyText = false;
    this.yearBtnHighlight = false;
    this.monthBtnHighlight = true;
    // this.barBtnHighlight = false;
    // this.pieBtnHighlight = true;
    this.chartButtons = true;
  }

  ngOnDestroy() {
    this.allFaultType = [];
  }

  print(): void {
    let printContents, popupWin, printbutton, yearlyReport, monthlyReport;
    if (this.monthlyChart == true) {
      // Syscraft comment
      // monthlyReport = document.getElementById("monthlyR").style.display = "block";
      monthlyReport = document.getElementById("monthlyR")!.style.display = "block";
    }
    else {
      // Syscraft comment
      // yearlyReport = document.getElementById("yearlyR").style.display = "block";
      yearlyReport = document.getElementById("yearlyR")!.style.display = "block";
    }
    // Syscraft comment
    // printbutton = document.getElementById('inputprintbutton1').style.display = "none";
    // printContents = document.getElementById('printDiv').innerHTML;
    printbutton = document.getElementById('inputprintbutton1')!.style.display = "none";
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
              }
              .row{
                display:flex; 
                flex-direction:row;
                width:100%;
                justify-content:space-arround;  
                border-bottom: 1px solid #ccc;
                padding-bottom:20px;
                margin-bottom:20px;
              }
              .row h1 ,.row h2 ,.row h3,.row h4{
                font-size:25px;
              }
              h3{
                text-align: center;
              }
              .row .col-md-6{
                width:50%;
                border-bottom: none;
                border-top: none;
              }
              .apexcharts-ycrosshairs {
                display: none;
              }
              .apexcharts-ycrosshairs-hidden {
                display: none;
              }
              table{
              width:100%;
              margin-top:50px;
              }
              table tr:nth-child(even) {
                background: #f5f5f5;
              }
              table thead tr th {
              font-size: 12px;
              text-align:left;
              background-color:#000;  
              color:#fff;
              padding:10px;
              }
              table tbody tr td {
              padding:10px;
              font-size: 12px;
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
              
            </style>
          </head>
      <body onload="window.print();window.close()"> 

      ${printContents}</body>
        </html>`
    );

    if (this.monthlyChart == true) {
      // Syscraft comment
      // monthlyReport = document.getElementById("monthlyR").style.display = "none";
      monthlyReport = document.getElementById("monthlyR")!.style.display = "none";
    }
    else {
      // Syscraft comment
      // yearlyReport = document.getElementById("yearlyR").style.display = "none";
      yearlyReport = document.getElementById("yearlyR")!.style.display = "none";
    }
    // Syscraft comment
    // printbutton = document.getElementById('inputprintbutton1').style.display = "block";
    // popupWin.document.close();
    printbutton = document.getElementById('inputprintbutton1')!.style.display = "block";
    popupWin!.document.close();

  }

}
