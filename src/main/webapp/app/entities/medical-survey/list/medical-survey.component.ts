import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMedicalSurvey } from '../medical-survey.model';
import { MedicalSurveyService } from '../service/medical-survey.service';
import { MedicalSurveyDeleteDialogComponent } from '../delete/medical-survey-delete-dialog.component';

@Component({
  selector: 'jhi-medical-survey',
  templateUrl: './medical-survey.component.html',
})
export class MedicalSurveyComponent implements OnInit {
  medicalSurveys?: IMedicalSurvey[];
  isLoading = false;

  constructor(protected medicalSurveyService: MedicalSurveyService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.medicalSurveyService.query().subscribe({
      next: (res: HttpResponse<IMedicalSurvey[]>) => {
        this.isLoading = false;
        this.medicalSurveys = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMedicalSurvey): number {
    return item.id!;
  }

  delete(medicalSurvey: IMedicalSurvey): void {
    const modalRef = this.modalService.open(MedicalSurveyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.medicalSurvey = medicalSurvey;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
