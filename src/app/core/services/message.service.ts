import { Injectable } from '@angular/core';
import { BaseUrl } from '../../config/url-config'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient,
  private _localStorageService: LocalStorageService) { }

  addMessages(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'MessageControllerAPI/AddUpdateMessage', data);
  }

  deleteMessages(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'MessageControllerAPI/DeleteMessage', data);
  }

  getMessages(data: any): Observable<any> {
    return this.http.post<any>(this.api + 'MessageControllerAPI/GetMessage', data);
  }

}
