import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { CompanyReportResponse, CompanyReportReadingIssue } from '../models/report-wizard.model';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ReportWizardService {
  public subject = new Subject<any>();
  api = BaseUrl.baseApiUrl;

  httpUploadOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
  }

  constructor(private http: HttpClient) { }


  getCompanyDetailReading(data: any): Observable<CompanyReportResponse> {
    return this.http.post<CompanyReportResponse>(this.api + 'ReportWizardAPI/GetCompanyDetailReadings', data);
  }

  changedCompanyDetailsReading(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'ReportWizardAPI/SaveOrUpdateCompanyReportDetailsReading', data);
  }

  addReportWizard(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'ReportWizardAPI/AddReportWizard', data);
  }

  addCompanyReportDetail(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'ReportWizardAPI/CompanyReportDetail', data);
  }

  deleteReport(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'ReportWizardAPI/DeleteReportDetail', data)
  }


  saveReportDetailIssue(request: CompanyReportReadingIssue): Observable<any> {
    var formData = new FormData();
    for (let key in request) {
      if (key == 'issuesImages' || key == 'issuesVideos' || key == 'graph') {
        // Syscraft comment
        // for(let i = 0; i < request[key].length; i++) {
        //  formData.append(key, request[key][i]);
        for (let i = 0; i < request[key]!.length; i++) {
          formData.append(key, request[key]![i]);
        }
      } else if (key == 'deletedSystemImages' || key == 'deletedSystemVideos') {
        // Syscraft comment
        // for(let i = 0; i < request[key].length; i++) {
        //   formData.append(key, JSON.stringify(request[key][i]));
        for (let i = 0; i < request[key]!.length; i++) {
          formData.append(key, JSON.stringify(request[key]![i]));
        }
      } else {
        // Syscraft comment
        // if(request[key]) formData.append(key, request[key]);
        // if (request[key]!) formData.append(key, request[key]!);
      }
    }

    return this.http.put(this.api + 'ReportWizardAPI/SaveOrUpdateCompanyReportDetailsIssue', formData);
  }

  // setValue(booleanValue: boolean) {
  //   this.subject.next({ value: booleanValue });
  // }

  // getValue() {
  //   return this.subject.asObservable();
  // }

}
