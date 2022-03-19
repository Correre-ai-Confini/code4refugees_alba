import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventTypeComponent } from './list/event-type.component';
import { EventTypeDetailComponent } from './detail/event-type-detail.component';
import { EventTypeUpdateComponent } from './update/event-type-update.component';
import { EventTypeDeleteDialogComponent } from './delete/event-type-delete-dialog.component';
import { EventTypeRoutingModule } from './route/event-type-routing.module';

@NgModule({
  imports: [SharedModule, EventTypeRoutingModule],
  declarations: [EventTypeComponent, EventTypeDetailComponent, EventTypeUpdateComponent, EventTypeDeleteDialogComponent],
  entryComponents: [EventTypeDeleteDialogComponent],
})
export class EventTypeModule {}
