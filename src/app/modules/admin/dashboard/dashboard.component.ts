import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { BaseUrl } from '../../../config/url-config';
import { Subscription } from 'rxjs';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { ReportWizardService } from '../../../core/services/report-wizard.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { FullCmReportComponent } from '../full-cm-report/full-cm-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export type ChartOptions = {
  series: ApexAxisChartSeries | undefined;
  chart: ApexChart | undefined;
  xaxis: ApexXAxis | undefined;
  stroke: ApexStroke | undefined;
  dataLabels: ApexDataLabels | undefined;
  markers: ApexMarkers | undefined;
  tooltip: any | undefined; // ApexTooltip;
  yaxis: ApexYAxis | undefined;
  grid: ApexGrid | undefined;
  legend: ApexLegend | undefined;
  title: ApexTitleSubtitle | undefined;
  colors: String[] | undefined
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    NgApexchartsModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FullCmReportComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // Syscraft comment
  // @ViewChild('permissionsTemplate') modal: ElementRef;
  // @ViewChild("chart") chart: ChartComponent;
  @ViewChild('permissionsTemplate') modal!: ElementRef;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  reportDate: any;
  assignedCompany: any;
  popOutData: boolean =  false;

  leftTable: boolean = false;
  rightTable: boolean = false;

  readingId:number = 0;

  // Syscraft comment
  // assign: boolean;
  // noAssign: boolean;
  assign!: boolean;
  noAssign!: boolean;
  userId: any;
  userName: any;
  companyId: any;
  companyReadingData: any[] = [];
  companyReadingData1: any;
  companyReadingData2: any;
  notFound: boolean = true;
  loadFullCmReport: boolean = false;
  color: any = null;

  acceptableValue: any[] = [];
  cautionValue: any[] = [];
  warningValue: any[] = [];

  // Syscraft comment
  // totalAcceptable : number;
  // totalCaution : number;
  // totalWarning : number;

  totalAcceptable! : number;
  totalCaution! : number;
  totalWarning! : number;
  lastTwelveMonthGraphData:  any[] = [];
  dashboardGraphValues: any[] = [];
  categoryData: any[] = [];
  categories: any;
  percOfAcceptable:any;
  percOfWarning:any;
  percOfCaution:any;

  
  api = BaseUrl.apiUrl;
  showModal:boolean = true;
  notEmpty: boolean = false;
  emptyData: boolean = true;
  
  // Syscraft comment
  // popOut: boolean;
  popOut!: boolean;
  storePopOutDataForComp: any = [];
  popOutfinalData: any = [];

  storeCompanyReportDetailReadingId: any[] = [];
  storePopOutData: any[]=[];
  intValue: number = 1;
  graphIntValue = 1;

  // Syscraft comment
  // id: number;
  id!: number;
  loadMsgComponent: boolean = false;

  // Syscraft comment
  // companyReportDetailReadingId: number;
  companyReportDetailReadingId!: number
  emptyPopOut: boolean = false;

  searchFilterSub: Subscription;
  constructor(
    private globalService: GlobalCodeService,
    private reportWizardService: ReportWizardService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    
  ) { 

    // Line Chart
    this.chartOptions = {

      chart: {
        height: 350,
        type: "line",
        // width: 300
      },
      colors: ['#DC4146', '#FFC234', '#4FA845'],

      stroke: {
        width: 5,
        curve: "straight",
        colors: ['#DC4146', '#FFC234', '#4FA845']
      },

      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        },
        colors: ['#DC4146', '#FFC234', '#4FA845']
      },

      grid: {
        borderColor: "#f1f1f1"
      },
      xaxis: {
        labels:{
          rotate: -90,
        }
      }
    };
   
    this.searchFilterSub = this.globalService.searchFilter$.subscribe(value => {
      this.searchFilter(value);
    })

  }

  
  ngOnInit(): void {
    const user = this.localStorageService.getUserCredentials();
    this.userName = user.userName;
    this.userId = user.userId;

    this.dashboardDropdown();
    this.getGraphLastMonthData();
    this.getCompanyReadings();
    this.graphVariableEmpty();
    const compId = this.localStorageService.getCompanyId();
    if(compId.companyId == 0){
      this.companyId = 0;
    }else{
      this.companyId = compId.companyId;
    }
    this.storePopOutData = [];
    this.storeCompanyReportDetailReadingId = [];
  }

  dashboardDropdown(){
    this.globalService.getAssignedCompany({userId: this.userId}).subscribe(res => {
      this.assignedCompany = res.assignedUserCompanies;
      if(this.assignedCompany){
          if(this.companyId == 0){
          this.companyId=this.assignedCompany[0].companyId;
          const index = this.assignedCompany.findIndex((x: any)=> x.companyId == this.companyId);
          this.localStorageService.storeCompanyId(this.assignedCompany[index]);
        }else{
          const index = this.assignedCompany.findIndex((x: any)=> x.companyId == this.companyId);
          this.localStorageService.storeCompanyId(this.assignedCompany[index]);
        }
        this.loadFullCmReport = true;
        this.getCompanyReadings(); 
        this.getGraphLastMonthData();
        this.assign = true;
        this.noAssign = false;
      }else{
        this.assign = false;
        this.noAssign = true;
      }
      
    }, error => {
      
    }) 
  }

  getCompanyId(value: any){
    const index = this.assignedCompany.findIndex((x: any)=> x.companyId == value);
    this.localStorageService.storeCompanyId(this.assignedCompany[index]);
    
    this.companyId = value;
    this.notFound = true;

    this.graphVariableEmpty();
    this.getCompanyReadings();
    this.getGraphLastMonthData();
    this.storePopOutData = [];
    this.popOutfinalData = [];
    this.storePopOutDataForComp = [];
    this.storeCompanyReportDetailReadingId = [];

  }

  
  getCompanyReadings(){
    this.SpinnerService.show();
    const companyId = Number(this.companyId ? this.companyId : 0);
    this.globalService.getCompanyDetailReadings({companyId: companyId, page:0, limit:0, orderBy:"CreatedOn", orderByDescending:true, allRecords:true}).subscribe(res => {
      this.localStorageService.storeCompanyReadingId(res.companyDetailReadingResponses);
      this.companyReadingData = res.companyDetailReadingResponses;
      if(this.companyReadingData && this.companyReadingData.length > 0)
      {
        this.companyReadingData = this.localStorageService.getCompanyReadingId();
        const dashbordData = this.companyReadingData.map(data => {
          this.storeCompanyReportDetailReadingId.push(data.companyReportDetailReadingId);
          if(data.originalColor == "N/R"){
            data.cross = true;
          }else{
            data.cross = false;
          }
          return data;
        })
        
        this.reportDate = this.companyReadingData[0].reportDate;
        this.companyReadingData = this.globalService.sortByNumeric(this.companyReadingData,"companyDetailId");
        this.getPopOutDetails();

      }else{
        if(this.intValue == 1){
          this.getCompanyReadings();
          this.intValue = 2;
        }
      }
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.SpinnerService.hide();
      }, 500);
      if(this.companyReadingData && this.companyReadingData.length > 0){
        this.notFound =  false;
      }else {
        this.notFound =  true;
      }
      this.splitData(this.companyReadingData);
    }, error =>{
      this.companyReadingData = this.localStorageService.getCompanyReadingId();

    })

  }

  filteredData: any;
  onSelect(val: any){
    if(val != "all"){
      this.filteredData = this.companyReadingData.filter(x => x.globalCodeId == val);
      this.splitData(this.filteredData);
    }else{
      this.splitData(this.companyReadingData);
    }
  }

  loadComponent:boolean =false;


  splitData(data: any){
    if(data!=null)
    {
      const len = data.length,
      mid = len / 2;
        this.companyReadingData1  = data.slice(0, mid);  
        this.companyReadingData2 = data.slice(mid, len);
    }
    else{
      this.companyReadingData1 = null;
      this.companyReadingData2 = null;
    }
  }

  // Syscraft comment
  // lastWarning : number;
  // lastCaution: number;
  // lastAcceptable: number;

  lastWarning! : number;
  lastCaution!: number;
  lastAcceptable!: number;

  getGraphLastMonthData(){
    const date = moment().format();
    const id = Number(this.companyId ? this.companyId : 0);
    this.globalService.companyDashboardForLastTwelveMonths({companyId: id, requestDate:date}).subscribe(res => {
      const resData = JSON.parse(res.dashboardStatusGraphResponse);
      if(resData){
        if(resData.length == 0){
          return;
        }
        const data = JSON.parse(resData[0].JSONSTRING);
        for(let i = 0; i < data.length; i++){
          this.lastAcceptable = data[i].Green;
          this.lastWarning = data[i].Red;
          this.lastCaution = data[i].Yellow
        }
        const lastTwelveMonthData = data;
          lastTwelveMonthData.map((data: any) => {
          data.categories = moment(data.ReportDate).format("DD/MM/YYYY");
          this.categoryData.push(data.categories);
          this.categories = {
            labels: {
              rotate: -75,
              style: {
                fontSize: "10px",
                fontFamily: "Helvetica, Arial, sans-serif",
              }
            },
            categories: this.categoryData
          }
          data.acceptableValue = Number(data.Green)
          this.acceptableValue.push(data.acceptableValue);
          this.totalAcceptable = this.acceptableValue.reduce((acc, cur) => acc + Number(cur), 0);
          data.cautionValue = Number(data.Yellow)
          this.cautionValue.push(data.cautionValue);
          this.totalCaution = this.cautionValue.reduce((acc, cur) => acc + Number(cur), 0);
          data.warningValue = Number(data.Red)
          this.warningValue.push(data.warningValue);
          this.totalWarning = this.warningValue.reduce((acc, cur) => acc + Number(cur), 0);
          this.lastTwelveMonthGraphData.push(this.acceptableValue, this.cautionValue, this.warningValue);
          const firstdata = {name: "Acceptable", data: this.lastTwelveMonthGraphData[0]};
          const seconddata = {name: "Caution", data: this.lastTwelveMonthGraphData[1]};
          const thirddata = {name: "Warning", data: this.lastTwelveMonthGraphData[2]};
          this.dashboardGraphValues = [thirddata, seconddata, firstdata];
          
          const totalNumber = Number(this.lastAcceptable) + Number(this.lastCaution)+Number(this.lastWarning);
          this.percOfAcceptable = (this.lastAcceptable/totalNumber * 100).toFixed(2);
          this.percOfWarning = (this.lastWarning/totalNumber * 100).toFixed(2);
          this.percOfCaution = (this.lastCaution/totalNumber * 100).toFixed(2);
          
          return data;
        })
      }else{
        if(this.graphIntValue == 1){
          this.graphVariableEmpty();
          this.getGraphLastMonthData();
          this.graphIntValue = 2;
        }
        
      }
     
    }, error => {
    })
  }

  windowScroll(){
    window.scrollTo(0, 0);
  }

  searchFilter(searchValue: string){
    searchValue = searchValue.trim();
    const allReadings = this.companyReadingData;
    if(!searchValue){
      this.notFound = false;
      this.splitData(allReadings);
    }

    const searchedlist = allReadings.filter((reading) => {
      const cmpNo = reading.companyNo.toLowerCase().includes(searchValue.toLowerCase());
      const area = reading.companyArea.toLowerCase().includes(searchValue.toLowerCase());
      const assetId = reading.assetId.toLowerCase().includes(searchValue.toLowerCase());
      return cmpNo || area || assetId;
    })
    this.notFound = searchedlist?.length == 0;
    this.splitData(searchedlist);

  }

  openModal(object: any) {
  
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "companyId" : this.companyId,
          "companyReportDetailReadingId": object.companyReportDetailReadingId ? object.companyReportDetailReadingId : -1,
          "companyArea": object.companyArea,
          "assetId": object.assetId,
          "companyDetailId": object.companyDetailId
        }
      };
      this.router.navigate(["/admin/full-cm-report"], navigationExtras);
      window.scrollTo(0, 0);
    
  }

  leftPopUpHover(id: number, originalColor: any, assetId: any, companyArea: any){
    
    if(id > 0 && originalColor != null){
      this.leftTable = true;
      this.rightTable = false;
      const index = this.popOutfinalData.findIndex((x: any) => (x.AssetId === assetId && x.CompanyArea == companyArea && x.id == id ) ); 
      if(index == -1){
        this.emptyPopOut = true;
      }else{
        this.emptyPopOut = false;
      }
      if(index > -1){
        if(this.popOutfinalData[index].left == false){
          this.popOutfinalData[index].left = true;
        }
      }
      
      this.readingId = id;
      this.loadComponent = true;
    }
  }

  rightPopUpHover(id: number, originalColor: any, assetId: any, companyArea: any){
    if(id > 0 && originalColor != null){
      this.leftTable = false;
      this.rightTable = true;
      const index = this.popOutfinalData.findIndex((x: any) => (x.AssetId === assetId && x.CompanyArea == companyArea && x.id == id)); 
      if(index == -1){
        this.emptyPopOut = true;
      }else{
        this.emptyPopOut = false;
      }
      if(index > -1){
        if(this.popOutfinalData[index].right == false){
          this.popOutfinalData[index].right = true;
        }
      }
      
      
      this.readingId = id;
      this.loadComponent = true;
    }
  }

  mouseLeaveHidePopOut(assetId: any, setIdentifier: number, detailId: any){
    this.emptyPopOut = false;
    const index = this.popOutfinalData.findIndex((x: any) => (x.AssetId === assetId  && x.id == detailId)); 
    if(index > -1){
      if(setIdentifier == 1){
        if(this.popOutfinalData[index].left == true || this.popOutfinalData[index].left == false){
          this.popOutfinalData[index].left = false;
        }
      }else{
        if(this.popOutfinalData[index].right == true || this.popOutfinalData[index].right == false){
          this.popOutfinalData[index].right = false;
        }
      }
    }
    
  }

  graphVariableEmpty(){
    this.dashboardGraphValues = [];
    this.categories = [];
    this.acceptableValue = [];
    this.cautionValue = [];
    this.warningValue = [];
    this.lastTwelveMonthGraphData = [];
    this.dashboardGraphValues = [];
    this.categoryData = [];
    this.totalAcceptable = 0;
    this.totalCaution = 0;
    this.totalWarning = 0;
    
    this.percOfAcceptable = 0;
    this.percOfWarning = 0;
    this.percOfCaution = 0;
  }


  // PopOut api

  getPopOutDetails(){
    this.SpinnerService.show();
    for(let i=0; i<=this.storeCompanyReportDetailReadingId.length; i++){
      const readingId = this.storeCompanyReportDetailReadingId[i];
      if(readingId){
        this.globalService.getCompanyDetailPopOut({companyReportDetailReadingId:readingId}).subscribe(res => {
         
          const data = JSON.parse(res.data);
          if(data){
            const popOutData = JSON.parse(data[0].CompnayDetailPopOutResponse);
            if(popOutData){
              this.storePopOutData.push(popOutData[0]);
            }
            this.storePopOutDataForComp.push({id: readingId, left: false, right:false});
            const popUpdata = this.storePopOutData.map((item, index) => ({ ...item, ...this.storePopOutDataForComp[index] }));
            const last = popUpdata[popUpdata.length-1];
            this.popOutfinalData.push(last);
            if(popOutData[0]){
              this.notEmpty = true;
              this.emptyData = false
            }else{
              this.notEmpty = false;
              this.emptyData = true 
            }
            setTimeout(() => {
              /** spinner ends after 2 seconds */
              this.SpinnerService.hide();
            }, 500);
          }
          
        })
        
      }
    } 
  }

  ngOnDestroy(){
    this.searchFilterSub.unsubscribe();
  }

}
