import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { GlobalCodeService } from '../../../core/services/global-code.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showSidebar: boolean = false;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private globalService: GlobalCodeService
  ) { }
  userName: any;

  overlay: boolean = false;
  crossIcon: boolean = false;
  barIcon: boolean = true;

  ngOnInit(): void {
    const user = this.localStorageService.getUserCredentials();
    this.userName = user.userName;
    // this.showOverlay();
  }

  searchFilter(event: any) {
    this.globalService.searchFilter.next(event.target.value);
  }

  logout() {
    this.localStorageService.logout();
    this.router.navigateByUrl("/login");
  }

  get isMobile() {
    return document.body.clientWidth < 991;
  }


  toggle() {
    if (this.showSidebar == false) {
      this.showSidebar = true;
      this.crossIcon = true;
      this.barIcon = false;
      this.overlay = true;

    } else {
      this.showSidebar = false;
      this.crossIcon = false;
      this.barIcon = true;
      this.overlay = false;
    }
  }

  showOverlay() {

  }


  qrScanCode() {
    //   this.showQRscanCode = true;
  }


  get hasPrescriptive() {
    return this.router.url == '/admin/prescriptive-maintenance';
  }
}
