import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient,
  private _localStorageService: LocalStorageService) { }

  getAllUsers(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/GetUser', data);
  }

  createUser(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/Register', data);
  }

  updateUser(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/UpdateUser', data);
  }

  deleteUser(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/DeleteUser', data);
  }

  getUserByAccountType(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/GetUserByAccountType', data);
  }

}
