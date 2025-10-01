import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
// import { QRCodeModule } from 'angularx-qrcode';
// import { CoreModule } from '../../../core/core.module';
import { ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    // QRCodeModule,
    FormsModule,
    // CoreModule,
    ToastrModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
