import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFamilyRelation } from '../family-relation.model';
import { FamilyRelationService } from '../service/family-relation.service';

@Component({
  templateUrl: './family-relation-delete-dialog.component.html',
})
export class FamilyRelationDeleteDialogComponent {
  familyRelation?: IFamilyRelation;

  constructor(protected familyRelationService: FamilyRelationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.familyRelationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
