import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from '../add-user/add-user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    MatTableModule,
    AddUserComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  userTable: string[] = ['Contact Name', 'User Name', 'Admin or Standard User', 'Email', 'Actions'];
  userData: any;
  editData: any;
  addUserForm:boolean = false;

  searchFilterSub: Subscription;
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private globalService: GlobalCodeService
  ) {
    this.searchFilterSub = this.globalService.searchFilter$.subscribe(value => {
      this.applyFilter(value);
    })
   }

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser(){
    this.SpinnerService.show();
    this.userService.getAllUsers({userId:0, page:0, limit: 0, orderBy: "CreatedOn", orderByDescending: true, allRecords: true}).subscribe(res => {
      this.userData = new MatTableDataSource(res.userResponsesList);
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.SpinnerService.hide();
      }, 500);
    })
  }

  public applyFilter = (value: string) => {
    this.userData.filter = value.trim().toLocaleLowerCase();
  }

  deleteUser(id: number){
    let confirmation = confirm('Do you want to delete this User?');
    if (confirmation) {
      this.userService.deleteUser({userId:id }).subscribe(res => {
        this.getAllUser();
        this.toastr.success('Successfully', 'User Delete', {
          timeOut: 2000
        });
        }, error => {
        })
    }
  }

  updateUser(object: any) {
    let userData = this.localStorageService.getUserCredentials();
    this.addUserForm = true;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "userId": object.userId,
        "actionBy": userData.UserId,
        "userName": object.userName,
        "phoneNumber": object.phoneNumber,
        "contactName": object.contactName,
        "email": object.email,
        "assignCompanyIdRequests": JSON.stringify(object.userCompany),
        "accountTypeId": object.accountType.accountTypeId
      }
    };
    this.router.navigate(["/admin/add-user"], navigationExtras);

  }

  ngOnDestroy(){
    this.searchFilterSub.unsubscribe();
  }
}
