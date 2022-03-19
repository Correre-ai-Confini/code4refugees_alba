import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPerson } from '../person.model';
import { PersonService } from '../service/person.service';

@Component({
  templateUrl: './person-delete-dialog.component.html',
})
export class PersonDeleteDialogComponent {
  person?: IPerson;

  constructor(protected personService: PersonService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.personService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
