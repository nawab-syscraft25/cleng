import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-brg-id-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './brg-id-list.component.html',
  styleUrl: './brg-id-list.component.scss'
})
export class BrgIdListComponent {
  brgType: any[] = [];
  brgTypeDataForFilter: any[] = [];

  codeName: string = "";
  // Syscraft comment
  // globalCodeCategoryId: number;
  globalCodeCategoryId: number | undefined;
  notFound: boolean = false;

  searchFilterSub: Subscription;
  constructor(
    private globalCodeService: GlobalCodeService,
  ) { 
    this.searchFilterSub = this.globalCodeService.searchFilter$.subscribe(value => {
      this.searchFilter(value);
    })
  }

  ngOnInit(): void {
    this.getBrgId();
  }

  getBrgId(){
    this.globalCodeService.getGlobalCodeCategory({ name: "BrgId" }).subscribe(res => {
      this.brgType = res.data.globalCodeMainResponse.globalCodeResponse;
      this.brgTypeDataForFilter = this.brgType;
      if(this.brgType.length > 0) this.globalCodeCategoryId = this.brgType[0].globalCodeCategoryId;
      this.brgType = this.globalCodeService.sortByAlphabetical(this.brgType,'codeName');
    })
  }

  createGlobalCode(){
    let params = {
      "globalCodeCategoryId": this.globalCodeCategoryId,
      "codeName": this.codeName,
      "description": this.codeName,
      "isActive": true
    }
    this.globalCodeService.createGlobalCode(params).subscribe(res => {
      this.getBrgId();
    })
  }

  searchFilter(searchTerm: string){
    searchTerm = searchTerm.trim();
    const allReport = this.brgTypeDataForFilter;
    if(!searchTerm){
      this.notFound = false;
      this.brgType = allReport;
    }
  
    const searchedlist = allReport.filter((type) => {
      const codeName = type.codeName.toLowerCase().includes(searchTerm.toLowerCase());
      const desc = type.description.toLowerCase().includes(searchTerm.toLowerCase());
      return codeName || desc;
    })
    this.notFound = searchedlist?.length == 0;
    this.brgType = searchedlist;
  }
  
  ngOnDestroy(){
    this.searchFilterSub.unsubscribe();
  }
}
