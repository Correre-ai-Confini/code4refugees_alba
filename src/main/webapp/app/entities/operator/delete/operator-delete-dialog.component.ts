import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOperator } from '../operator.model';
import { OperatorService } from '../service/operator.service';

@Component({
  templateUrl: './operator-delete-dialog.component.html',
})
export class OperatorDeleteDialogComponent {
  operator?: IOperator;

  constructor(protected operatorService: OperatorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.operatorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
