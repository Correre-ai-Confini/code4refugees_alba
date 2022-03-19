import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LegalSurveyService } from '../service/legal-survey.service';
import { ILegalSurvey, LegalSurvey } from '../legal-survey.model';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentService } from 'app/entities/attachment/service/attachment.service';

import { LegalSurveyUpdateComponent } from './legal-survey-update.component';

describe('LegalSurvey Management Update Component', () => {
  let comp: LegalSurveyUpdateComponent;
  let fixture: ComponentFixture<LegalSurveyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let legalSurveyService: LegalSurveyService;
  let attachmentService: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LegalSurveyUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(LegalSurveyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LegalSurveyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    legalSurveyService = TestBed.inject(LegalSurveyService);
    attachmentService = TestBed.inject(AttachmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Attachment query and add missing value', () => {
      const legalSurvey: ILegalSurvey = { id: 456 };
      const attachment: IAttachment = { id: 94702 };
      legalSurvey.attachment = attachment;

      const attachmentCollection: IAttachment[] = [{ id: 3715 }];
      jest.spyOn(attachmentService, 'query').mockReturnValue(of(new HttpResponse({ body: attachmentCollection })));
      const additionalAttachments = [attachment];
      const expectedCollection: IAttachment[] = [...additionalAttachments, ...attachmentCollection];
      jest.spyOn(attachmentService, 'addAttachmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ legalSurvey });
      comp.ngOnInit();

      expect(attachmentService.query).toHaveBeenCalled();
      expect(attachmentService.addAttachmentToCollectionIfMissing).toHaveBeenCalledWith(attachmentCollection, ...additionalAttachments);
      expect(comp.attachmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const legalSurvey: ILegalSurvey = { id: 456 };
      const attachment: IAttachment = { id: 27356 };
      legalSurvey.attachment = attachment;

      activatedRoute.data = of({ legalSurvey });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(legalSurvey));
      expect(comp.attachmentsSharedCollection).toContain(attachment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LegalSurvey>>();
      const legalSurvey = { id: 123 };
      jest.spyOn(legalSurveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalSurvey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: legalSurvey }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(legalSurveyService.update).toHaveBeenCalledWith(legalSurvey);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LegalSurvey>>();
      const legalSurvey = new LegalSurvey();
      jest.spyOn(legalSurveyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalSurvey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: legalSurvey }));
      saveSubject.complete();

      // THEN
      expect(legalSurveyService.create).toHaveBeenCalledWith(legalSurvey);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LegalSurvey>>();
      const legalSurvey = { id: 123 };
      jest.spyOn(legalSurveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ legalSurvey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(legalSurveyService.update).toHaveBeenCalledWith(legalSurvey);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAttachmentById', () => {
      it('Should return tracked Attachment primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAttachmentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
