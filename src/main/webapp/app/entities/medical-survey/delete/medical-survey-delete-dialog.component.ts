import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicalSurvey } from '../medical-survey.model';
import { MedicalSurveyService } from '../service/medical-survey.service';

@Component({
  templateUrl: './medical-survey-delete-dialog.component.html',
})
export class MedicalSurveyDeleteDialogComponent {
  medicalSurvey?: IMedicalSurvey;

  constructor(protected medicalSurveyService: MedicalSurveyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.medicalSurveyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
