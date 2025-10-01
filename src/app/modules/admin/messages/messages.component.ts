import { Component, Input } from '@angular/core';
import { BaseUrl } from '../../../config/url-config';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../../core/services/message.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  // Syscraft comment
  // @Input('messageData') messageData: number;
  @Input('messageData') messageData!: number;
  api = BaseUrl.apiUrl;

  // Syscraft comment
  // msgInputTxt : '';
  msgInputTxt! : '';
  msgList = [];
  messagesList: any[] = [];

  // Syscraft comment
  // userId: number;
  userId!: number;
  notFound: boolean = true;
  constructor(
    private toastr: ToastrService,
    private messageServices: MessageService,
    private localStorageService: LocalStorageService,
    private SpinnerService: NgxSpinnerService,
    private route: ActivatedRoute,
  ) {  }
  
  companyDetailId: number = 0;

  // Syscraft comment
  // companyId: number;
  companyId!: number;

  // Syscraft comment
  // imageError: string;
  // isImageSaved: boolean;
  // cardImageBase64: string;
  // imageType: string;
  // assetId: string;
  // companyNo: string;

  imageError!: string;
  isImageSaved!: boolean;
  cardImageBase64!: string;
  imageType!: string;
  assetId!: string;
  companyNo!: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.companyDetailId = params.companyDetailId;
      this.companyId = params.companyId;
      this.assetId = params.assetId;
      this.companyNo =  params.companyNo
    })
    const userId = this.localStorageService.getUserCredentials();
    this.userId = userId.userId;
    this.getMessage();
  }

  getMessage(){
    const companyDetailId = Number(this.companyDetailId ? this.companyDetailId : 0);
    this.messageServices.getMessages({companyDetailId: companyDetailId, messageId:0, page:0, limit:0, orderBy:"CreatedOn", orderByDescending:true, allRecords: true}).subscribe(res => {
      this.messagesList = res.messageResponseList;
      if(this.messagesList && this.messagesList.length > 0){
        this.notFound = false;
      }else{
        this.notFound = true;
      }
    })
  }

  params = {
    messageFromId: 0,
    messageTitle: "string",
    messageDescription: "string",
    messageDate: "string",
    companyId: 0,
    companyDetailId: 0,
    messageId: 0,
    images: "string",
    imagesType: "string",
    actionBy: "string"
  }



  editMsgData : any;
  editMessage(object: any){
    
    const tempDate = moment().format();
    this.isImageSaved = true;
    this.msgInputTxt = object.messageDescription;
    this.cardImageBase64 = this.api + object.imagesResponse.imageUrl;
    this.params.messageFromId = this.userId;
    this.params.companyId = Number(this.companyId ? this.companyId : 0);
    this.params.companyDetailId = Number(this.companyDetailId ? this.companyDetailId : 0);
    this.params.messageId = object.messageId;
    this.params.messageDate = tempDate ;
    this.editMsgData = this.params;
    this.imageType = String(object.imagesResponse.imageType)
    this.imageUrl = object.imagesResponse.imageUrl
  }
  addMessage(){
    this.SpinnerService.show();
    if(this.params.messageId > 0){
      this.updateMessage();
    }
    const tempDate = moment().format()
    this.params.messageDescription = this.msgInputTxt;
    this.params.messageFromId = this.userId;
    this.params.companyId = Number(this.companyId ? this.companyId : 0);
    this.params.companyDetailId = Number(this.companyDetailId ? this.companyDetailId : 0);
    this.params.images= this.imageUrl;
    this.params.imagesType = this.imageType;
    this.params.messageDate = tempDate ;
    this.messageServices.addMessages(this.params).subscribe(res => {
      this.msgInputTxt = '';
      
      this.isImageSaved = false;
      this.notFound = false;
      this.imageType = "";
      this.imageUrl = "";
      this.getMessage();
      this.toastr.success('', res.message, {
        timeOut: 2000
      });
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.SpinnerService.hide();
      }, 500);
    })
  }
  
  updateMessage(){
    this.SpinnerService.show();
    this.params.messageDescription = this.msgInputTxt;
    this.params.images= this.imageUrl;
    this.params.imagesType= this.imageType;
    
    this.messageServices.addMessages(this.editMsgData).subscribe(res => {
      
      this.msgInputTxt = '';
      // this.cardImageBase64 = "assets/img/dnd/ic-file.svg";
      this.isImageSaved = false;
      this.notFound = false;
      this.imageType = "";
      this.imageUrl = "";
      this.params.messageId = 0;
      this.getMessage();
      this.toastr.success('', res.message, {
        timeOut: 2000
      });
      setTimeout(() => {
        /** spinner ends after 2 seconds */
        this.SpinnerService.hide();
      }, 500);
    })
  }

  deleteMessage(id : number){
    let confirmation = confirm('Do you want to delete this Message?');
    if (confirmation) {
      this.messageServices.deleteMessages({messageId:id}).subscribe(res => {
        if(this.messagesList && this.messagesList.length > 0){
          this.notFound = false;
        }else{
          this.notFound = true;
        }
        this.getMessage();
        this.toastr.success('Successfully', 'Message Delete', {
          timeOut: 2000
        });
      })
    }
   
  }

  imageUrl : any;
  imageVideoType: any;
  fileChangeEvent(fileInput: any) {
    // Syscraft comment
    // this.imageError = null;
    this.imageError = "";
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
    const file = fileInput.target.files[0];
    reader.readAsDataURL(file);
    this.imageType = file.type.split('/')[1];
    
    reader.onload = (e: any) => {
      const image = new Image();
      image.src = e.target.result;
      this.imageUrl = String(reader.result).split(',')[1];  
    }  
  }  
  }
}
