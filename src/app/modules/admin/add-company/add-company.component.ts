import { Component, Input } from '@angular/core';
import { BaseUrl } from '../../../config/url-config';
import { CompanyDetails, CompanyModal } from '../../../core/models/company.model';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../../../core/services/company.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MessagesComponent } from '../messages/messages.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    MatTableModule,
    MatSelectModule,
    RouterModule,
    MessagesComponent,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.scss'
})
export class AddCompanyComponent {
  @Input('editData') editData: any;
  api = BaseUrl.apiUrl;
  messageIcon: boolean = false;
  loadComponent: boolean = false;
  addCompanyData: CompanyModal = {
    companyName: "",
    companyId: 0,
    addUpdateCompnayDetails: [],
    actionBy: ""
  }

  companyDetailData: CompanyDetails = {
    rownum: 0,
    companyDetailId: 0,
    actionType: 0,
    companyNo: "",
    companyArea: "",
    assetId: "",
    sapNo: "",
    assetImage: "",
    imageType: "",
    isImage: false,
  }

  public companyFields: CompanyDetails[] = [{
    rownum: 0,
    companyDetailId: 0,
    actionType: 0,
    companyNo: "",
    companyArea: "",
    assetId: "",
    sapNo: "",
    assetImage: "",
    imageType: "",
    isImage: false
  }];


  constructor(
    private toastr: ToastrService,
    private companyService: CompanyService,
    private localStorage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalCodeService,
    private SpinnerService: NgxSpinnerService
  ) { }

  storeData: any
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.storeData = params;

      this.addCompanyData.companyName = params["companyName"];
      this.addCompanyData.companyId = params["companyId"];
      this.addCompanyData.actionBy = params["actionBy"];
      this.companyFields = JSON.parse(params["addUpdateCompnayDetails"]);
      this.companyFields = this.globalService.sortByNumeric(this.companyFields, "companyDetailId");
      for (var i = 0; i < this.companyFields.length; i++) {
        this.companyFields[i].actionType = 0;
        this.companyFields[i].rownum = i + 1;

      }

      this.addCompanyData.addUpdateCompnayDetails = this.companyFields;

      // Syscraft comment
      // if (this.addCompanyData.addUpdateCompnayDetails[0].companyDetailId > 0) {
      if (this.addCompanyData.addUpdateCompnayDetails[0].companyDetailId! > 0) {
        this.messageIcon = true;
      }
      for (var i = 0; i < this.companyFields.length; i++) {
        this.companyFields[i].assetImage = "";
        this.companyFields[i].imageType = "";
      }
    });
  }

  //Upload image
  uploadPdf(fileInput: any, index: number) {
    const reader = new FileReader();
    const file = fileInput.target.files[0];
    reader.readAsDataURL(file);
    const fileType = file.type.split('/')[1];
    reader.onload = (fileInput: any) => {
      const image = new Image();
      image.src = fileInput.target.result;
      const img = String(reader.result).split(',')[1];
      this.companyFields[index].assetImage = img;
      this.companyFields[index].imageType = fileType;
    }
  }

  addCompany(form: NgForm) {
    if (this.addCompanyData.companyId > 0) {
      this.updateCompany();
    } else {
      if (form.valid) {
        this.SpinnerService.show();
        let userData = this.localStorage.getUserCredentials();
        this.addCompanyData.actionBy = userData.email;
        this.addCompanyData.companyId = 0;
        this.companyFields = this.companyFields.filter(x => x.actionType != 1);
        this.companyFields = this.companyFields.filter(x => x.companyNo != null);
        for (let i = 0; i < this.companyFields.length; i++) {
          if (this.companyFields[i].assetImage) {
            this.companyFields[i].isImage = true;
          }
        }
        this.addCompanyData.addUpdateCompnayDetails = this.companyFields;
        this.companyService.addCompany(this.addCompanyData).subscribe(res => {
          this.SpinnerService.hide();
          setTimeout(() => {
            this.toastr.success('Successful', 'Company Created', {
              timeOut: 2000
            });
            this.router.navigateByUrl("/admin/company");
          }, 500)

        }, error => {

        })

      }
    }

  }

  updateCompany() {
    this.SpinnerService.show();
    let userData = this.localStorage.getUserCredentials();
    this.addCompanyData.actionBy = userData.email;
    this.addCompanyData.companyName = this.addCompanyData.companyName;
    this.addCompanyData.companyId = Number(this.addCompanyData.companyId);
    for (let i = 0; i < this.companyFields.length; i++) {
      if (this.companyFields[i].assetImage) {
        this.companyFields[i].isImage = true;
      }
    }
    this.addCompanyData.addUpdateCompnayDetails = this.companyFields;
    this.companyService.UpdateCompany(this.addCompanyData).subscribe(res => {
      setTimeout(() => {
        this.SpinnerService.hide();
        this.toastr.success('Successful', 'Company Update', {
          timeOut: 2000
        });
        this.router.navigateByUrl("/admin/company");
      }, 500)

    }, error => {
    })
  }

  addMoreField() {
    var max = Math.max.apply(Math, this.companyFields.map(function (o) { return o.rownum; }))

    this.companyFields.push({
      rownum: max + 1,
      companyDetailId: 0,
      actionType: 0,
      companyNo: "",
      companyArea: "",
      assetId: "",
      sapNo: "",
      assetImage: "",
      imageType: "",
      isImage: false
    });
  }

  removeField(i: number) {
    var index = this.companyFields.findIndex(x => x.rownum === i)
    this.companyFields[index].actionType = 1;

  }
  filterItemsOfType() {

    return this.companyFields.filter(x => x.actionType === 0);

  }
  windowScroll() {
    window.scrollTo(0, 0);
  }

  messageId: any
  messageClickIcon(object: any) {
    this.loadComponent = true;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "companyDetailId": object.companyDetailId,
        "companyId": this.addCompanyData.companyId,
        "companyNo": object.companyNo,
        "assetId": object.assetId
      }
    };
    this.router.navigate(["/admin/messages"], navigationExtras)
  }
}
