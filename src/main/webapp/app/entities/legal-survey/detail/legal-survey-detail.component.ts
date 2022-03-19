import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILegalSurvey } from '../legal-survey.model';

@Component({
  selector: 'jhi-legal-survey-detail',
  templateUrl: './legal-survey-detail.component.html',
})
export class LegalSurveyDetailComponent implements OnInit {
  legalSurvey: ILegalSurvey | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ legalSurvey }) => {
      this.legalSurvey = legalSurvey;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
