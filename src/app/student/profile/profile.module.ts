import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { MyProfileComponent } from "../my-profile/my-profile.component";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from "@shared/shared.module";

@NgModule({
  declarations: [MyProfileComponent],
  imports: [CommonModule,
     ProfileRoutingModule,FormsModule,
    // BrowserModule,
    // BrowserAnimationsModule,
    HttpClientModule,
    SharedModule.forRoot(),],
})
export class ProfileModule {}
