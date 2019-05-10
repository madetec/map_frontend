import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
    },
    {path: 'main', loadChildren: './main/main-driver.module#MainDriverPageModule'},
    {path: 'profile', loadChildren: './profile/profile-driver.module#ProfileDriverPageModule'},
    {path: 'order/history', loadChildren: './order/history/order-driver-history.module#OrderDriverHistoryPageModule'},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DriverRoutingModule {
}
