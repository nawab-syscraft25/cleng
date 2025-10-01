import { Component } from '@angular/core';
import { AuthModel } from '../../../core/models/auth.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CompareDirective } from '../../../shared/directives/compare.directive';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    CompareDirective
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  // Syscraft comment
  // email: string;
  // token: string;
  email!: string;
  token!: string;
  responseData: any;

  forgotPassword: AuthModel = {
    // Syscraft comment
    // newPassword: null,
    // confirmPassword: null
    newPassword:"",
    confirmPassword:  ''
  }
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {

    // Syscraft comment
    // this.email = this.route.snapshot.queryParams.email
    // this.token = this.route.snapshot.queryParams.token;
    this.email = this.route.snapshot.queryParams['email']
    this.token = this.route.snapshot.queryParams['token'];

    let query = {
      email: this.email,
      token: this.token
    }
    this.authService.resetPasswordToken(query).subscribe(res => {
      this.responseData = res;
    }, error => {
      if (error = "Bad Request") {
        this.router.navigateByUrl("/error");
      }
    })
  }


  submit(form: NgForm) {

    if (form.valid) {
      let query = {
        // Syscraft comment
        // email: this.route.snapshot.queryParams.email,
        email: this.route.snapshot.queryParams['email'],
        newPassword: this.forgotPassword.newPassword,
        userName: ""
      }

      this.authService.changePassword(query).subscribe(res => {
        this.responseData = res;
        setTimeout(() => {
          this.toastr.success('Successful', 'Password Reset', {
            timeOut: 2000
          });
          this.router.navigateByUrl("/login");
        }, 500)

      }, error => {
        if (error = "Bad Request") {
          this.router.navigateByUrl("/error");
        }
      })

    }
  }
}
