import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LocalStorageService } from "../services/local-storage.service";
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _localStorageService: LocalStorageService,
    private _route: Router, private _activatedRoute: ActivatedRoute) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 0 || err.status === 401) {

        this._localStorageService.logout();
        window.location.href = "/login";

      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
