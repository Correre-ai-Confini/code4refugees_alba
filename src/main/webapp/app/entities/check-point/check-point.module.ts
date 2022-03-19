import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CheckPointComponent } from './list/check-point.component';
import { CheckPointDetailComponent } from './detail/check-point-detail.component';
import { CheckPointUpdateComponent } from './update/check-point-update.component';
import { CheckPointDeleteDialogComponent } from './delete/check-point-delete-dialog.component';
import { CheckPointRoutingModule } from './route/check-point-routing.module';

@NgModule({
  imports: [SharedModule, CheckPointRoutingModule],
  declarations: [CheckPointComponent, CheckPointDetailComponent, CheckPointUpdateComponent, CheckPointDeleteDialogComponent],
  entryComponents: [CheckPointDeleteDialogComponent],
})
export class CheckPointModule {}
