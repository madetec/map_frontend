import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuardService} from './@core/guards/authentication-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
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
    loadChildren: './user/user-routing.module#UserRoutingModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
