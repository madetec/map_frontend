import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuardService} from './@core/guards/authentication-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'reset-pass', loadChildren: './reset-pass/reset-pass.module#ResetPassPageModule' },
  { path: 'error', loadChildren: './error/error.module#ErrorPageModule' },
  { path: 'to-modal', loadChildren: './modals/order/location/to/to-modal.module#ToModalModule' },
  { path: 'active-modal', loadChildren: './modals/order/active/active-modal.module#ActiveModalModule' },
  { path: 'wait-modal', loadChildren: './modals/order/wait/wait-modal.module#WaitModalModule' },
  {
    path: 'user',
    canActivate: [AuthenticationGuardService],
    data: {role: 'user'},
    loadChildren: './user/user-routing.module#UserRoutingModule'
  },
  {
    path: 'driver',
    canActivate: [AuthenticationGuardService],
    data: {role: 'driver'},
    loadChildren: './driver/driver-routing.module#DriverRoutingModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
