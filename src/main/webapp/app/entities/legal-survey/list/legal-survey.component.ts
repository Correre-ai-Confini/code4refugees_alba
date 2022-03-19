import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILegalSurvey } from '../legal-survey.model';
import { LegalSurveyService } from '../service/legal-survey.service';
import { LegalSurveyDeleteDialogComponent } from '../delete/legal-survey-delete-dialog.component';

@Component({
  selector: 'jhi-legal-survey',
  templateUrl: './legal-survey.component.html',
})
export class LegalSurveyComponent implements OnInit {
  legalSurveys?: ILegalSurvey[];
  isLoading = false;

  constructor(protected legalSurveyService: LegalSurveyService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.legalSurveyService.query().subscribe({
      next: (res: HttpResponse<ILegalSurvey[]>) => {
        this.isLoading = false;
        this.legalSurveys = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILegalSurvey): number {
    return item.id!;
  }

  delete(legalSurvey: ILegalSurvey): void {
    const modalRef = this.modalService.open(LegalSurveyDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.legalSurvey = legalSurvey;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
