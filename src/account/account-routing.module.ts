import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';
import { OtpComponent } from './otp/otp.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { WatchComponent } from './watch/watch.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AccountComponent,
                children: [
                    { path: 'login', component: LoginComponent },
                    { path: 'watch', component: WatchComponent },
                    { path: 'otp/:id', component: OtpComponent },
                    { path: 'otp/:id/:otp', component: OtpComponent },
                    { path: 'register', component: RegisterComponent },
                    { path: 'forgot-password', component: ForgotPasswordComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
