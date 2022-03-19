import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RefugeeComponent } from './list/refugee.component';
import { RefugeeDetailComponent } from './detail/refugee-detail.component';
import { RefugeeUpdateComponent } from './update/refugee-update.component';
import { RefugeeDeleteDialogComponent } from './delete/refugee-delete-dialog.component';
import { RefugeeRoutingModule } from './route/refugee-routing.module';

@NgModule({
  imports: [SharedModule, RefugeeRoutingModule],
  declarations: [RefugeeComponent, RefugeeDetailComponent, RefugeeUpdateComponent, RefugeeDeleteDialogComponent],
  entryComponents: [RefugeeDeleteDialogComponent],
})
export class RefugeeModule {}
