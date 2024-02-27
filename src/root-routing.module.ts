import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppSessionService } from '@shared/session/app-session.service';
let homeRoute: string = "";
const routes: Routes = [
    { path: '', redirectTo: '/app/home', pathMatch: 'full' },
    {
        path: 'account',
        loadChildren: () => import('account/account.module').then(m => m.AccountModule), // Lazy load account module
        data: { preload: true }
    },
    {
        path: 'app',
        loadChildren: () => import('app/app.module').then(m => m.AppModule), // Lazy load account module
        data: { preload: true }
    },
    {
        path: 'admin',
        loadChildren: () => import('admin/admin.module').then(m => m.AdminModule), // Lazy load account module
        data: { preload: true }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', useHash: true, onSameUrlNavigation: 'reload', scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
    exports: [RouterModule],
    providers: []
})

export class RootRoutingModule {
    // userRoles: any = [];
    // constructor(
    //     private _userService: UserServiceProxy,
    //     private _sessionService: AppSessionService) {
    //   
    //     if (this._sessionService.userId != null) {
    //         this._userService.get(this._sessionService.userId).subscribe((res) => {
    //             this.userRoles = res.roleNames;
    //         })
    //         if (this.userRoles.includes('Admin')) {
    //             homeRoute = "/app/home";
    //         }
    //         else {
    //             homeRoute = "/app/student/student-profile"
    //         }
    //     }

    // }

}
