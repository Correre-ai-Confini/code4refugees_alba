import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRefugee } from '../refugee.model';
import { RefugeeService } from '../service/refugee.service';

@Component({
  templateUrl: './refugee-delete-dialog.component.html',
})
export class RefugeeDeleteDialogComponent {
  refugee?: IRefugee;

  constructor(protected refugeeService: RefugeeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.refugeeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
