import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FirstRegistrationRoutingModule } from "./route/first-registration-routing.module";
import { FirstRegistrationNewComponent } from "./update/first-registration-new.component";

@NgModule({
  imports: [SharedModule, FirstRegistrationRoutingModule],
  declarations: [
    FirstRegistrationNewComponent,
  ],
})
export class FirstRegistrationModule {}
