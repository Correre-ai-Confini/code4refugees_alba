import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAttachmentCategory } from '../attachment-category.model';
import { AttachmentCategoryService } from '../service/attachment-category.service';

@Component({
  templateUrl: './attachment-category-delete-dialog.component.html',
})
export class AttachmentCategoryDeleteDialogComponent {
  attachmentCategory?: IAttachmentCategory;

  constructor(protected attachmentCategoryService: AttachmentCategoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.attachmentCategoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
