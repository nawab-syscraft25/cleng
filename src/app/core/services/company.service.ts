import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient,
    private _localStorageService: LocalStorageService) { }

  getAllCompany(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'Companies/GetCompanies', data);
  }

  deleteCompany(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'Companies/DeleteCompany', data);
  }

  addCompany(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'Companies/AddCompany', data);
  }

  UpdateCompany(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'Companies/UpdateCompany', data);
  }


}
