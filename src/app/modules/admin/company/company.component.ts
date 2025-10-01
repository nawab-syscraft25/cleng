import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CompanyService } from '../../../core/services/company.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AddCompanyComponent } from '../add-company/add-company.component';
// import { MessagesComponent } from '../messages/messages.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatTableModule,
    AddCompanyComponent,
    // MessagesComponent,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent {
  companyTable: string[] = ['Company', 'Assigned Users', 'Actions'];

  editData: any;
  addCompanyData: boolean = false;
  companyList: any;

  searchFilterSub: Subscription;
  constructor(
    private toastr: ToastrService,
    private companyService: CompanyService,
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
    this.getAllCompany();
  }

  
  getAllCompany(){
    this.SpinnerService.show();
    this.companyService.getAllCompany({companyId:0, page:0, limit:0, orderBy:"CompanyName", orderByDescending:true, allRecords:true}).subscribe(res => {
      this.companyList = new MatTableDataSource(res.companiesResponseList);
      console.log("companyList nawab",this.companyService);
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.SpinnerService.hide();
      }, 500);
    }, (error: any) => {
    
    })
  }

  public applyFilter = (value: string) => {
    this.companyList.filter = value.trim().toLocaleLowerCase();
  }

  updateCompany(object: any){
    let userData = this.localStorageService.getUserCredentials();
    this.addCompanyData = true;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "companyId": object.companyId,
        "companyName":object.companyName,    
        "actionBy": userData.userId,
        "addUpdateCompnayDetails": JSON.stringify(object.companyDetailList)
      }
    };
    this.router.navigate(["/admin/add-company"], navigationExtras)
  }


  addCompany(){
    
    let userData = this.localStorageService.getUserCredentials();
    this.addCompanyData = true;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "companyId": 0,
        "companyName":"",    
        "actionBy": userData.userId,
        "addUpdateCompnayDetails":JSON.stringify([
          {
            "companyDetailId": 0,
            "actionType": 0,
            "companyNo": "",
            "companyArea": "",
            "assetId": "",
            "sapNo": "",
          }])
    }
    };
    this.router.navigate(["/admin/add-company"], navigationExtras)
  }

  deleteCompany(id: number){
    let confirmation = confirm('Do you want to delete this Row?');
    if (confirmation) {
      this.companyService.deleteCompany({companyId: id}).subscribe((res: any) => {
        this.toastr.success('Successfully', 'Company Delete', {
          timeOut: 2000
        });
        this.getAllCompany();
        }, (error: any) => {
        })
    }
    
  }

  ngOnDestroy(){
    this.searchFilterSub.unsubscribe();
  }

}
