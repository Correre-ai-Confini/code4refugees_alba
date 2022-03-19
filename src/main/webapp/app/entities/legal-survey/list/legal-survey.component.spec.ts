import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LegalSurveyService } from '../service/legal-survey.service';

import { LegalSurveyComponent } from './legal-survey.component';

describe('LegalSurvey Management Component', () => {
  let comp: LegalSurveyComponent;
  let fixture: ComponentFixture<LegalSurveyComponent>;
  let service: LegalSurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LegalSurveyComponent],
    })
      .overrideTemplate(LegalSurveyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LegalSurveyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LegalSurveyService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.legalSurveys?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
