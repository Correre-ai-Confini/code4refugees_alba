import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistration } from '../registration.model';
import { RegistrationService } from '../service/registration.service';

@Component({
  templateUrl: './registration-delete-dialog.component.html',
})
export class RegistrationDeleteDialogComponent {
  registration?: IRegistration;

  constructor(protected registrationService: RegistrationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.registrationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
