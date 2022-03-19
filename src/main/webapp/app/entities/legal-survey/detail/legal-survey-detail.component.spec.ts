import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LegalSurveyDetailComponent } from './legal-survey-detail.component';

describe('LegalSurvey Management Detail Component', () => {
  let comp: LegalSurveyDetailComponent;
  let fixture: ComponentFixture<LegalSurveyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LegalSurveyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ legalSurvey: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LegalSurveyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LegalSurveyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load legalSurvey on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.legalSurvey).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
