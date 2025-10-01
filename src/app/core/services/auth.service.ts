import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient,
  private _localStorageService: LocalStorageService) { }

  login(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/Login', data);
  }

  sendForgotPasswordEmail(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/SetResetPasswordToken', data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/ChangePassword', data);
  }

  resetPasswordToken(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'UserAuthAPI/ValidateResetPasswordToken', data);
  }

}
