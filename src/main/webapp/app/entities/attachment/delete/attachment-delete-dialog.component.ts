import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAttachment } from '../attachment.model';
import { AttachmentService } from '../service/attachment.service';

@Component({
  templateUrl: './attachment-delete-dialog.component.html',
})
export class AttachmentDeleteDialogComponent {
  attachment?: IAttachment;

  constructor(protected attachmentService: AttachmentService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.attachmentService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
