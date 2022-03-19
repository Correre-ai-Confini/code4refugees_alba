import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILegalSurvey } from '../legal-survey.model';
import { LegalSurveyService } from '../service/legal-survey.service';

@Component({
  templateUrl: './legal-survey-delete-dialog.component.html',
})
export class LegalSurveyDeleteDialogComponent {
  legalSurvey?: ILegalSurvey;

  constructor(protected legalSurveyService: LegalSurveyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.legalSurveyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
