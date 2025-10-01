import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  hide: boolean = true;
  @Input() showsidebar: any;
  @Input() crossIcon: any;
  @Input() barIcon: any;
  @Input() overlay: any;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
  ) { }

  userName: any;
  accountType: any;

  ngOnInit(): void {

    const userAccount = this.localStorageService.getUserCredentials();
    this.userName = userAccount.userName;
    this.accountType = userAccount.accountType.accountTypeName;
  }

  reportWizard() {
    this.router.navigateByUrl("/admin/report-wizard");
    window.scrollTo(0, 0);
  }
  prescriptiveMaintenance() {
    window.scrollTo(0, 0);
  }

  logout() {
    this.localStorageService.logout();
    this.router.navigateByUrl("/login");
  }

  hideClass() {
    this.showsidebar = false;
    this.crossIcon = false;
    this.barIcon = true;
    this.overlay = false;
  }


  qrScanCode() { }
}
