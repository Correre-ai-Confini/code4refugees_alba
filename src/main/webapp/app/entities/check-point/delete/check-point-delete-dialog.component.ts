import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICheckPoint } from '../check-point.model';
import { CheckPointService } from '../service/check-point.service';

@Component({
  templateUrl: './check-point-delete-dialog.component.html',
})
export class CheckPointDeleteDialogComponent {
  checkPoint?: ICheckPoint;

  constructor(protected checkPointService: CheckPointService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.checkPointService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
