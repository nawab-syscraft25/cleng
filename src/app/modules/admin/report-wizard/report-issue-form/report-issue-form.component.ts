import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CompanyReportReadingIssue } from '../../../../core/models/report-wizard.model';
import { GlobalCodeService } from '../../../../core/services/global-code.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, NgForm } from '@angular/forms';
import { BaseUrl } from '../../../../config/url-config';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../../progress-bar/progress-bar.component';
import { SafeUrlPipe } from '../../../../shared/pipes/safe.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DndDirective } from '../../../../shared/directives/dnd.directive';

@Component({
  selector: 'app-report-issue-form',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ProgressBarComponent,
    SafeUrlPipe,
    DndDirective
  ],
  templateUrl: './report-issue-form.component.html',
  styleUrl: './report-issue-form.component.scss',
  providers: [SafeUrlPipe]
})
export class ReportIssueFormComponent {
  @Output() formChange = new EventEmitter<object>();
  // Syscraft comment
  // @Input() readingIssue: CompanyReportReadingIssue;
  @Input() readingIssue!: CompanyReportReadingIssue;
  @Input() submitted: boolean = false;

  faultIds: any = [];

  // Syscraft comment
  // @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  dragFiles: any[] = [];
  imageFiles: any[] = [];
  getFaultAndVibrationType : any;
  constructor(
    private globalCodeService: GlobalCodeService,
    private toastr: ToastrService,
  ) { }
  dragAndDropValue : boolean = true;
  // isUnsavedValue = false;
  ngOnInit(): void {
    this.getFault();
    this.getVibrationType();
    this.getUnitType();
    this.getPriorityNo();
    this.getBrgId();
  }
 
  vibrationType : any = [];
  unitType: any = [];
  priorityNo: any = [];
  brgType: any = [];
  show: boolean =  false;

  defaultArr = {categoryName: "FaultType", codeName: "None", createdOn: "2020-06-10T22:45:02.093", description: "None", globalCodeCategoryId: 6, globalCodeId: -1, isActive: true };
  
  getFault() {
    this.globalCodeService.getGlobalCodeCategory({ name: "FaultType" }).subscribe(res => {
      this.faultIds = res.data.globalCodeMainResponse.globalCodeResponse;
      this.faultIds.splice(0, 0, this.defaultArr);
      this.faultIds = this.globalCodeService.sortByAlphabetical(this.faultIds,'codeName');
    })
  }

  getVibrationType(){
    this.globalCodeService.getGlobalCodeCategory({ name: "VibrationType" }).subscribe(res => {
      this.vibrationType = res.data.globalCodeMainResponse.globalCodeResponse;
      this.vibrationType = this.globalCodeService.sortByAlphabetical(this.vibrationType,'codeName');
    })
  }

  getUnitType(){
    this.globalCodeService.getGlobalCodeCategory({ name: "UnitType" }).subscribe(res => {
      this.unitType = res.data.globalCodeMainResponse.globalCodeResponse;
      this.unitType = this.globalCodeService.sortByAlphabetical(this.unitType,'codeName');
    })
  }

  getPriorityNo(){
    this.globalCodeService.getGlobalCodeCategory({ name: "PriorityNo" }).subscribe(res => {
      this.priorityNo = res.data.globalCodeMainResponse.globalCodeResponse;
      this.priorityNo = this.globalCodeService.sortByAlphabetical(this.priorityNo,'codeName');
    })
  }

  getBrgId(){
    
    this.globalCodeService.getGlobalCodeCategory({ name: "BrgId" }).subscribe(res => {
      this.brgType = res.data.globalCodeMainResponse.globalCodeResponse;
      ;
      this.brgType = this.globalCodeService.sortByAlphabetical(this.brgType,'codeName');
    }, error => {
      ;
    })
  }


  uploadFiles(event: any) {
    const { name, files } = event.target;

    if (files) {
      var filesAmount = files.length;

      let previousFiles = [];
      if(name == "issuesVideos") {
        if(this.readingIssue.issuesVideos && this.readingIssue.issuesVideos.length > 0)
          previousFiles = this.readingIssue.issuesVideos;
      } else {
        if(this.readingIssue.issuesImages && this.readingIssue.issuesImages.length > 0)
          previousFiles = this.readingIssue.issuesImages;
      }

      let imageFiles = [...previousFiles];

      for (let i = 0; i < filesAmount; i++) {
        imageFiles.push(files[i]);
      }

      this.formChangedManually(name, imageFiles);

      event.target.value = null;
    }
  }

  deleteFile(name: string, imageIndex: number) {
    // Syscraft comment
    // if (this.readingIssue[name]) {
    //   let images = this.readingIssue[name].filter((element: any, index: any) => index != imageIndex);

    // Syscraft comment (Please add these lines of Code as well from line no. 126-129)
    // if (this.readingIssue[name]) {
      // let images = this.readingIssue[name].filter((element: any, index: any) => index != imageIndex);
      // this.formChangedManually(name, images);
    // }
  }

  deleteSystemImageFile(imageIndex: number) {
    let systemImagesRespone = this.readingIssue.systemImagesResponses;
    let deletedSystemImages = this.readingIssue.deletedSystemImages;

    if(!deletedSystemImages) deletedSystemImages = [];
    deletedSystemImages.push(systemImagesRespone[imageIndex]);

    let systemImages = systemImagesRespone.filter((element, index) => index !== imageIndex);

    this.formChangedMultipleManually({
      systemImagesResponses: systemImages,
      deletedSystemImages: deletedSystemImages
    });
  }

  deleteSystemVideoFile(videoIndex: number) {
    let systemVideosRespone = this.readingIssue.systemVideoResponses;
    let deletedSystemVideos = this.readingIssue.deletedSystemVideos;

    if(!deletedSystemVideos) deletedSystemVideos = [];
    deletedSystemVideos.push(systemVideosRespone[videoIndex]);

    let systemVideos = systemVideosRespone.filter((element, index) => index !== videoIndex);

    this.formChangedMultipleManually({
      systemVideoResponses: systemVideos,
      deletedSystemVideos: deletedSystemVideos
    });
  }

  deleteBrowseImage(){
    // Syscraft comment
    // this.readingIssue.graphImageExsisting = null;
    // this.readingIssue.graph = null;
    this.readingIssue.graphImageExsisting = "";
    this.readingIssue.graph = null as any;
  }

  submit(form: NgForm) {
    // if (form.valid) {
    //   console.log(this.reportWizardData);
    //   form.resetForm();
    // }

  }

  formChanged(e: any) {
    const { name, value } = e.target;
    this.formChange.emit({ [name]: value })
  }
  formChanged1(e: any, name: any) {
    this.formChange.emit({ [name]: e.value })
  }

  formChangedManually(name: string, value: any) {
    this.formChange.emit({ [name]: value });
  }

  formChangedMultipleManually(changedValues: object) {
    this.formChange.emit(changedValues);
  }

  serverImagePath(partialUrl: any) {
    return `${BaseUrl.apiUrl}/Upload/Issue/Image/${partialUrl}`;
  }

  serverVideoPath(partialUrl: any) {
    return `${BaseUrl.apiUrl}Upload/Issue/Video/${partialUrl}`;
  }

  serverDragImagePath(partialUrl: any) {
    return `${BaseUrl.apiUrl}/Upload/Graph/Image/${partialUrl}`;
  }

  


  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  dragDeleteFile(index: number) {
    if (this.dragFiles[index].progress < 100) {
      // console.log("Upload in progress.");
      return;
    }
    this.dragFiles.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.dragFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.dragFiles[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.dragFiles[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    if(this.readingIssue.graph && this.readingIssue.graphImageExsisting ){
      this.toastr.warning('warnning', 'you first remove the existing image!', {
        timeOut: 5000
      });
    }
    else{
      if(files.length >1)
        {
          this.toastr.warning('warnning', 'You can select a single image or drag and drop, please try again!', {
            timeOut: 5000
          });
        }
        else
        {
          if(this.dragFiles.length >= 1)
          {
            this.toastr.warning('warnning', 'You can select a single image or drag and drop, please try again!', {
              timeOut: 5000
            });
          }
          else
          {
            for (const item of files) {
              item.progress = 0;
              this.dragFiles.push(item);
              this.readingIssue.graph = this.dragFiles;
            }
            this.fileDropEl.nativeElement.value = "";
            this.uploadFilesSimulator(0);
          }

        }
    }
    
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

}
