import { Injectable, OnInit } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root', 
})
export class GlobalCodeService{
  private subject = new Subject<any>();
  // private subjectPrint = new Subject<any>();
  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }


  searchFilter = new Subject<string>();
  searchFilter$ = this.searchFilter.asObservable();

  getGlobalCodeCategory(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'GlobalCodesAPI/GetGlobalCodeByCategoryName', data);
  }

  getAllGlobalCode(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'GlobalCodesAPI/GetAllRecords', data);
  }

  createGlobalCode(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'GlobalCodesAPI/Create', data );
  }

  // Dashboard Api's
  getAssignedCompany(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'DashboardAPI/GetAssignedCompanies', data);
  }

  getCompanyDetailReadings(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'DashboardAPI/GetCompanyWithCompanyDetailReadings', data);
  }

  getCompanyDetailPopOut(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'DashboardAPI/GetCompanyDetailPopOut', data);
  }

  companyDashboardForLastTwelveMonths(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'DashboardAPI/GetCompanyDashboardForLastTwelveMonths', data);
  }


  // ShortCmReport Api
  getShortCMReportList(data: any) {
    return this.http.post<any>(this.api + 'FullAndShortCMReport/GetShortCMReort', data);
  }

  // FullCmReport APi
  getFullCMReportList(data: any) {
    return this.http.post<any>(this.api + 'FullAndShortCMReport/GetFullCMReort', data);
  }

 // FullCmReportDetail APi
 getFullCMReportDetail(data: any) {
  return this.http.post<any>(this.api + 'FullAndShortCMReport/GetFullCmReportDetails', data);
}
  getAssignedCompanyReportDetail(data: any) {

    return this.http.post<any>(this.api + 'FullAndShortCMReport/GetCompanyReportDetail', data);
  }

  saveCMSurveyPDF(data: any) {
    return this.http.post<any>(this.api + 'FullAndShortCMReport/SaveCMSurveyPDF', data);
  }

  // Prescriptive Maintenance Api
  getPrescriptiveMaintenance(data: any) {
    return this.http.post<any>(this.api + 'PrescriptiveMaintenanceAPI/GetPrescriptiveMaintenance', data);
  }
  getFaultCountForLastMonths(data: any) {
    return this.http.post<any>(this.api + 'PrescriptiveMaintenanceAPI/GetFaultCountForLastMonths', data);
  }
  
  // data is always of Array type
  // sortBy is used to sort the array and always present in Array
  sortByAlphabetical(data: any, sortBy: string) {
    if(data){
      let items = data.sort(function (a: any, b: any) {
        let t1 = a[sortBy].toUpperCase();
        let t2 = b[sortBy].toUpperCase();
        return t1.localeCompare(t2);
      });
      return items;
    }

  }

  sortByNumeric(data: any, sortBy: string) {
    if(data){
        let items = data.sort(function (a: any, b: any) {
        let t1 = a[sortBy];
        let t2 = b[sortBy]; 
        return t1 - t2;
      });
    return items;
    }

  }

  sortByCMPNo(data: any){
    if(data){
      data.sort((a: any, b: any) => {
        const first = a.companyDetail?.companyNo;
        const second = b.companyDetail?.companyNo;
        let firstVal = this.processText(first);
        let secondVal = this.processText(second);

        // Syscraft comment
        // return firstVal - secondVal || first.localeCompare(second);
        return firstVal! - secondVal! || first.localeCompare(second);

      });
    }
    
  }

  processText(inputText: any) {
    const numberArray = inputText.match(/\d+/);
    if (numberArray) return +numberArray[0];

    return null;
  }

  sendData(id: number) {
    this.subject.next({ checkId: id });
  }

  clearData() {
    // Syscraft comment
    // this.subject.next();
    this.subject.next('');
  }

  getData(): Observable<any> {
    return this.subject.asObservable();
  }




  // sendDataPrint(value: boolean) {
  //   debugger
  //   this.subjectPrint.next({ checkValue: value });
  // }

  // clearDataPrint() {
  //   this.subjectPrint.next();
  // }

  // getDataPrint(): Observable<any> {
  //   return this.subjectPrint.asObservable();
  // }


}
