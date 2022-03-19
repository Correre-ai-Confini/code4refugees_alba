import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventType } from '../event-type.model';
import { EventTypeService } from '../service/event-type.service';

@Component({
  templateUrl: './event-type-delete-dialog.component.html',
})
export class EventTypeDeleteDialogComponent {
  eventType?: IEventType;

  constructor(protected eventTypeService: EventTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
