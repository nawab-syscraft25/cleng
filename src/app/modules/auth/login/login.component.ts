import { Component } from '@angular/core';
import { AuthModel } from '../../../core/models/auth.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Syscraft comment
  // returnUrl : string;
  returnUrl!: string;
  token: any;
  loginData: AuthModel = {
    // Syscraft comment
    // email: null,
    // password: null
    email: "",
    password: ""
  }

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.returnUrl =
      this._activatedRoute.snapshot.queryParams["returnUrl"] || "/admin/dashboard";
    this.token = this.localStorageService.getAuthorizationToken();
    if (this.token !== null || this.token !== "" || this.token !== "undefine") {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  submit(form: NgForm) {
    if (form.valid) {
      this.authService.login(this.loginData).subscribe(res => {
        this.localStorageService.storeAuthToken(res.userResponse.token);
        this.localStorageService.storeUserCredentials(res.userResponse);

        this.router.navigateByUrl(this.returnUrl);

        this.toastr.success('successfully', 'User LogIn', {
          timeOut: 2000
        });

      }, error => {
        this.toastr.error('', 'Username or password is incorrect', {
          timeOut: 2000
        });
      })

    }

  }
}
