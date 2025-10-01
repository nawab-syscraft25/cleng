import { Component, Input } from '@angular/core';
import { CompanyId, UserModel } from '../../../core/models/user.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { CompanyService } from '../../../core/services/company.service';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  @Input('editData') editData: any;
  path: any;
  pageLocation: any;
  pathExtension: any;
  noRecordFound: boolean = true;
  accountType: any;
  companyDropdownData: any;
  userNameValidation: boolean = false
  userFormData: UserModel = {
    contactName: "",
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
    assignCompanyIdRequests: [],
    url: "",
    accountTypeId: 0
  }

  compnayName: any;
  storeCompanyName: any;
  companyNameList: any[] = [];


  userAssignCompany: CompanyId = {
    companyId: 0
  }

  public assignCompany: CompanyId[] = [{
    companyId: 0,
  }];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userSerice: UserService,
    private localStorage: LocalStorageService,
    private globalCodeService: GlobalCodeService,
    private route: ActivatedRoute,
    private companyService: CompanyService
  ) {

  }

  ngOnInit(): void {
    this.path = "/login";
    this.pageLocation = window.location.origin + this.path;

    this.route.queryParams.subscribe(params => {
      this.userFormData.contactName = params["contactName"];
      this.userFormData.userId = params["userId"];
      this.userFormData.userName = params["userName"];
      this.userFormData.phoneNumber = params["phoneNumber"];
      this.userFormData.email = params["email"];
      this.userFormData.accountTypeId = params["accountTypeId"];
      this.userFormData.actionBy = params["actionBy"];
      this.assignCompany = JSON.parse(params["assignCompanyIdRequests"]);

      this.userFormData.assignCompanyIdRequests = this.assignCompany;
      this.companyNameList = this.assignCompany;
      for (var i = 0; i < this.companyNameList.length; i++) {
        this.companyNameList[i].rownum = i + 1;
      }
      this.noRecordFound = false;
    });

    this.getGlobalAccountId();
    this.getAllCompany();
  }

  validUserName(event: any) {
    this.userNameValidation = false;
    this.userSerice.getAllUsers({ userId: 0, page: 0, limit: 0, orderBy: "CreatedOn", orderByDescending: true, allRecords: true }).subscribe(res => {
      const userListData = res.userResponsesList;
      userListData.forEach((element: any) => {
        if (element.userName == event) {
          this.userNameValidation = true;
        }
      });
    })
  }

  getGlobalAccountId() {
    this.globalCodeService.getGlobalCodeCategory({ name: "AccountType" }).subscribe(res => {
      this.accountType = res.data.globalCodeMainResponse.globalCodeResponse;
    })
  }

  getAllCompany() {
    this.companyService.getAllCompany({ companyId: 0, page: 0, limit: 0, orderBy: "CompanyName", orderByDescending: true, allRecords: true }).subscribe(res => {
      this.companyDropdownData = res.companiesResponseList;
      this.companyDropdownData = this.globalCodeService.sortByAlphabetical(this.companyDropdownData, 'companyName');
    })
  }

  createUser(form: NgForm) {
    // Syscraft comment
    // if (this.userFormData.userId > 0) {
      if (this.userFormData.userId! > 0) {
      this.updateUser();
    } else {
      if (form.valid && this.userNameValidation == false) {
        let userData = this.localStorage.getUserCredentials();
        this.userFormData.actionBy = userData.userName;
        this.userFormData.userId = userData.userId;
        this.assignCompany.map((item, key) => {
          this.userFormData.assignCompanyIdRequests[key] = this.assignCompany[key];
        });
        this.userFormData.url = this.pageLocation;
        this.userFormData.accountTypeId = Number(this.userFormData.accountTypeId);
        this.userFormData.phoneNumber = "0";
        this.userSerice.createUser(this.userFormData).subscribe(res => {
          setTimeout(() => {
            this.toastr.success('', res.message, {
              timeOut: 2000
            });
            this.router.navigateByUrl("/admin/user-list");
          }, 500)
        }, error => {
          this.toastr.error('', error.error, {
            timeOut: 2000
          });
        })
      }
    }

  }

  updateUser() {
    if (this.userNameValidation == false) {
      this.userFormData.assignCompanyIdRequests = this.companyNameList;
      this.userFormData.accountTypeId = Number(this.userFormData.accountTypeId);
      this.userFormData.userId = Number(this.userFormData.userId);
      let data = this.userFormData;
      this.userSerice.updateUser(data).subscribe(res => {
        setTimeout(() => {
          this.toastr.success('Successful', 'User Update', {
            timeOut: 2000
          });
          this.router.navigateByUrl("/admin/user-list");
        }, 500)
      }, error => {
        this.toastr.error('', error.error, {
          timeOut: 2000
        });
      })
    }

  }

  onChangeDropdown(companyId: any) {
    const getCompanyId = this.companyDropdownData.find((x: any) => x.companyId == companyId);
    if (getCompanyId) {
      this.storeCompanyName = getCompanyId;
    } else {
      this.compnayName = '';
    }
  }

  addCompany() {
    if (this.userAssignCompany.companyId) {
      this.assignCompany.push({
        companyId: this.userAssignCompany.companyId
      })
      this.companyNameList.push(this.storeCompanyName);
      this.companyNameList = this.companyNameList.filter(x => x.companyName);
      this.noRecordFound = false;
    } else {
      this.noRecordFound = true;
    }
  }

  deleteCompany(comp: any) {
    this.companyNameList = this.companyNameList.filter(x => x != comp);

    if (this.companyNameList.length == 0) {
      this.noRecordFound = false
    }
    else {
      this.noRecordFound = false;
    }
  }



  windowScroll() {
    window.scrollTo(0, 0);
  }

}
