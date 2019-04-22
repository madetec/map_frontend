import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
  { path: 'main-driver', loadChildren: './main-driver/main-driver.module#MainDriverPageModule' },
  { path: 'main-user', loadChildren: './main-user/main-user.module#MainUserPageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'order-history', loadChildren: './order-history/order-history.module#OrderHistoryPageModule' },
  { path: 'error', loadChildren: './error/error.module#ErrorPageModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
