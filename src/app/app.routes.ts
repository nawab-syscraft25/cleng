import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorComponent } from './shared/error/error.component';
import { LayoutComponent as LayoutComponentAuth } from './modules/auth/layout/layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { UnauthorisedComponent } from './shared/unauthorised/unauthorised.component';
import { LayoutComponent as LayoutComponentAdmin } from './modules/admin/layout/layout.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { UserListComponent } from './modules/admin/user-list/user-list.component';
import { AddUserComponent } from './modules/admin/add-user/add-user.component';
import { CompanyComponent } from './modules/admin/company/company.component';
import { AddCompanyComponent } from './modules/admin/add-company/add-company.component';
import { ReportWizardComponent } from './modules/admin/report-wizard/report-wizard.component';
import { ShortCmReportComponent } from './modules/admin/short-cm-report/short-cm-report.component';
import { FullCmReportComponent } from './modules/admin/full-cm-report/full-cm-report.component';
import { FullCmReportListComponent } from './modules/admin/full-cm-report-list/full-cm-report-list.component';
import { PrescriptiveMaintenanceComponent } from './modules/admin/prescriptive-maintenance/prescriptive-maintenance.component';
import { MessagesComponent } from './modules/admin/messages/messages.component';
import { BrgIdListComponent } from './modules/admin/brg-id-list/brg-id-list.component';
import { FullCmReportDetailComponent } from './modules/admin/full-cm-report-detail/full-cm-report-detail.component';
import { MainCmReportModalComponent } from './modules/admin/main-cm-report-modal/main-cm-report-modal.component';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full"
  },
  
  // Auth components
  {
    path: "",
    component: LayoutComponentAuth,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
      },
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent
      },
      {
        path: "reset-password",
        component: ResetPasswordComponent
      },
      {
        path: "error",
        component: UnauthorisedComponent,
      }
    ]
  },

  // Admin components
  {
    path: "admin",
    component: LayoutComponentAdmin,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "user-list",
        component: UserListComponent,
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] }
      },
      {
        path: "add-user",
        component: AddUserComponent,
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] }
      },
      {
        path: "company",
        component: CompanyComponent,
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] }
      },
      {
        path: "add-company",
        component: AddCompanyComponent,
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] }
      },
      {
        path: "report-wizard",
        component: ReportWizardComponent,
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] }
      },
      {
        path: "short-cm-report",
        component: ShortCmReportComponent,
      }, 
      {
        path: "full-cm-report",
        component: FullCmReportComponent,
      }, 
      {
        path: "full-cm-report-list",
        component: FullCmReportListComponent,
      }, 
      {
        path: "prescriptive-maintenance",
        component: PrescriptiveMaintenanceComponent,
      },

      {
        path: "messages",
        component: MessagesComponent,
      },
      {
        path: "brg-setup",
        component: BrgIdListComponent,
        canActivate: [AuthGuard],
        data: { roles: ["Admin"] }
      },
      {
        path: "full-cm-report-detail",
        component: FullCmReportDetailComponent,
      },
      {
        path: "qr-code",
        component: MainCmReportModalComponent,
      },
    ]
  },
  {
    path: "404",
    component: ErrorComponent
  },
  {
    path: "**",
    component: ErrorComponent
  },

  {
    path: "error",
    component: ErrorComponent
  }
];
