import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientDetailsComponent } from './components/patient-details/patient-details.component';
import { AuthGuard } from './guards/auth.guard';
import { ManageUsersComponent } from './components/manage-users/manage-users.component'; // ✅ Import Manage Users

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // ✅ Always accessible

  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'patient/:id', component: PatientDetailsComponent, canActivate: [AuthGuard] },

  { path: 'manage-users', component: ManageUsersComponent, canActivate: [AuthGuard] }, // ✅ Restricted to Admin

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route for logged-in users
  { path: '**', redirectTo: 'dashboard' } // Wildcard route
];
