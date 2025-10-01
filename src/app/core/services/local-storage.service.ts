import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  LOCALSTORAGE_TOKEN_KEY: string = 'AuthToken';
  LOCALSTORAGE_FORGOT_TOKEN_KEY: string = 'ForgotToken';
  LOCALSTORAGE_USER_DETAIL_KEY: string = 'UserDetails';
  LOCALSTORAGE_USER_CREDENTIALS_KEY: string = 'UserCredentials';
  LOCALSTORAGE_COMPANY_READINGID_KEY: string = 'CompanyReadingId';

  LOCALSTORAGE_COMPANYID_KEY: string = 'CompanyId'

  constructor() { }

  storeAuthToken(token: any) {
    localStorage.setItem(this.LOCALSTORAGE_TOKEN_KEY, token);    
  }

  storeResetPasswordToken(token: any) {
    localStorage.setItem(this.LOCALSTORAGE_FORGOT_TOKEN_KEY, token);    
  }

  removeAuthToken() {
    localStorage.removeItem(this.LOCALSTORAGE_TOKEN_KEY);
  }

  getAuthorizationToken() {
    return localStorage.getItem(this.LOCALSTORAGE_TOKEN_KEY);
  }

  getResetPasswordToken(){
    return localStorage.getItem(this.LOCALSTORAGE_FORGOT_TOKEN_KEY);
  }
  
  getForgotToken() {
    return localStorage.getItem(this.LOCALSTORAGE_FORGOT_TOKEN_KEY);
  }


  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.LOCALSTORAGE_TOKEN_KEY);
    if(token && token != '') {
      return true;
    }
    return false;
  }

  storeUserDetail(data: any) {
    localStorage.setItem(this.LOCALSTORAGE_USER_DETAIL_KEY, JSON.stringify(data));
  }

  storeUserCredentials(data: any) {
    
    localStorage.setItem(this.LOCALSTORAGE_USER_CREDENTIALS_KEY, JSON.stringify(data));
  }
  getUserCredentials(){
    let userCredentials = localStorage.getItem(this.LOCALSTORAGE_USER_CREDENTIALS_KEY);
    if(userCredentials)
      return JSON.parse(userCredentials);
      
    
    return { UserName: "", Password: "", accountType:{accountTypeName: ""} };
  }

  storeCompanyReadingId(id: any){
    localStorage.setItem(this.LOCALSTORAGE_COMPANY_READINGID_KEY, JSON.stringify(id));
  } 

  getCompanyReadingId(){
    let companyReadingId = localStorage.getItem(this.LOCALSTORAGE_COMPANY_READINGID_KEY);
    if(companyReadingId)
    return JSON.parse(companyReadingId);

    return { companyReportDetailReadingId: "" };
  }

  logout() {
    localStorage.removeItem(this.LOCALSTORAGE_TOKEN_KEY);
    localStorage.removeItem(this.LOCALSTORAGE_USER_DETAIL_KEY);
  }

  storeCompanyId(id: any){
    localStorage.setItem(this.LOCALSTORAGE_COMPANYID_KEY, JSON.stringify(id));
  }
  getCompanyId(){
    let companyId = localStorage.getItem(this.LOCALSTORAGE_COMPANYID_KEY);
    if(companyId)
    return JSON.parse(companyId);

    return { companyId: 0, companyName: "" };
  }

  

}
