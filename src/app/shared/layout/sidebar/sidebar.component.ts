import { Component, Input, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  hide: boolean = true;
  @Input() showsidebar: any;
  @Input() crossIcon: any;
  @Input() barIcon: any;
  @Input() overlay: any;

  userName: any;
  accountType: any;
  isDropdownOpen: boolean = false; // dropdown state

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userAccount = this.localStorageService.getUserCredentials();
    this.userName = userAccount.userName;
    this.accountType = userAccount.accountType.accountTypeName;
  }

  // ✅ Navigation methods
  reportWizard() {
    this.router.navigateByUrl('/admin/report-wizard');
    window.scrollTo(0, 0);
  }

  prescriptiveMaintenance() {
    window.scrollTo(0, 0);
  }

  qrScanCode() {}

  // ✅ Logout user
  logout() {
    this.localStorageService.logout();
    this.router.navigateByUrl('/login');
  }

  // ✅ Sidebar toggle controls
  hideClass() {
    this.showsidebar = false;
    this.crossIcon = false;
    this.barIcon = true;
    this.overlay = false;
  }

  // ✅ Dropdown toggle logic
  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
    this.hideClass(); // Optional: hide sidebar after clicking a dropdown item
  }

  // ✅ Auto-close dropdown if user clicks outside it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.nav-item.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
