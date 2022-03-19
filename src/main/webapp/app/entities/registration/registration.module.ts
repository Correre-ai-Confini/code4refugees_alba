import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RegistrationComponent } from './list/registration.component';
import { RegistrationDetailComponent } from './detail/registration-detail.component';
import { RegistrationUpdateComponent } from './update/registration-update.component';
import { RegistrationDeleteDialogComponent } from './delete/registration-delete-dialog.component';
import { RegistrationRoutingModule } from './route/registration-routing.module';

@NgModule({
  imports: [SharedModule, RegistrationRoutingModule],
  declarations: [RegistrationComponent, RegistrationDetailComponent, RegistrationUpdateComponent, RegistrationDeleteDialogComponent],
  entryComponents: [RegistrationDeleteDialogComponent],
})
export class RegistrationModule {}
