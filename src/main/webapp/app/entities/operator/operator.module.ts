import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OperatorComponent } from './list/operator.component';
import { OperatorDetailComponent } from './detail/operator-detail.component';
import { OperatorUpdateComponent } from './update/operator-update.component';
import { OperatorDeleteDialogComponent } from './delete/operator-delete-dialog.component';
import { OperatorRoutingModule } from './route/operator-routing.module';

@NgModule({
  imports: [SharedModule, OperatorRoutingModule],
  declarations: [OperatorComponent, OperatorDetailComponent, OperatorUpdateComponent, OperatorDeleteDialogComponent],
  entryComponents: [OperatorDeleteDialogComponent],
})
export class OperatorModule {}
