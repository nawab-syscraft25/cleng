import { Component } from '@angular/core';
import { AuthModel } from '../../../core/models/auth.model';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  pageLocation: any;
  path: any;
  pathExtension: any;
  forgotPassword: AuthModel = {
    // Syscraft comment
    // email: null
    email: ""
  }
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.path = "/reset-password";

    this.pageLocation = window.location.origin + this.path;
  }

  submit(form: NgForm) {

    console.log(this.forgotPassword.email);
    if (form.valid) {
      let query = {
        email: this.forgotPassword.email,
        url: this.pageLocation,
      }
      this.authService.sendForgotPasswordEmail(query).subscribe(res => {
        this.localStorageService.storeResetPasswordToken(res.userResponse.token);
        this.localStorageService.storeUserCredentials(res.email);

        this.toastr.success('', res.message, {
          timeOut: 2000
        });

      }, error => {

      })
    }
  }
}
