import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BaseUrl } from '../../../config/url-config';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { MessageService } from '../../../core/services/message.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
// import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-cm-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './main-cm-report-modal.component.html',
  styleUrl: './main-cm-report-modal.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainCmReportModalComponent {
  // Syscraft commant
  // @Input('cmpanyId') cmpanyId : number;
  @Input('cmpanyId') cmpanyId!: number;
  // @Input() pdfReportUrl: any;

  // Syscraft comment
  // @Input('companyReportDetailReadingId') companyReportDetailReadingId: number;
  @Input('companyReportDetailReadingId') companyReportDetailReadingId!: number;
  @Output() handleClose = new EventEmitter;
  api = BaseUrl.apiUrl;
  fullCmReportList: any;

  // Syscraft comment
  // msgInputTxt : '';
  msgInputTxt!: '';
  msgList = [];
  notEmpty: boolean = false;
  emptyData: boolean = true;
  messagesList: any[] = [];

  // Syscraft comment
  // readingId: number;
  readingId!: number;
  companyId: number = 0;
  notFound: boolean = true;
  editMsgData: any;

  // Syscraft comment
  // userId: number;
  userId!: number;
  companyDetailId: number = 0;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    // navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 3,
      },
      768: {
        items: 3,
      },
      1024: {
        items: 4,
      },
      1280: {
        items: 4,
      },

    },
    nav: true
  }
  constructor(
    private globalCodeService: GlobalCodeService,
    private localStorageService: LocalStorageService,
    private messageServices: MessageService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  pdfReportUrl: any;
  assetId: any;
  companyNo: any;
  ngOnInit(): void {
    const userId = this.localStorageService.getUserCredentials();
    this.userId = userId.userId;

    this.readingId = this.companyReportDetailReadingId;
    this.companyId = this.cmpanyId;


    this.route.queryParams.subscribe((parms: any) => {
      this.pdfReportUrl = parms.pdfReportUrl;
      this.companyNo = parms.companyNo;
      this.assetId = parms.assetId;
      console.log(this.pdfReportUrl);
    })

  }


  elementType = 'url';

  // Syscraft comment
  // @ViewChild('screen') screen: ElementRef;
  // @ViewChild('canvas') canvas: ElementRef;
  // @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('screen') screen!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('downloadLink') downloadLink!: ElementRef;

  downloadImage() {
    let data = this.pdfReportUrl;
    data = data.split("/admin");
    const url = "/admin" + data[1];
    html2canvas(this.screen.nativeElement).then((canvas: any) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'qr_code.png';
      this.downloadLink.nativeElement.click();
    });
    this.router.navigateByUrl(url);
  }

  goback() {
    let data = this.pdfReportUrl;
    data = data.split("/admin");
    const url = "/admin" + data[1];
    this.router.navigateByUrl(url);
  }

}
