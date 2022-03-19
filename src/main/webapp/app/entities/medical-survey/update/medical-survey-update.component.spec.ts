import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MedicalSurveyService } from '../service/medical-survey.service';
import { IMedicalSurvey, MedicalSurvey } from '../medical-survey.model';
import { IAttachment } from 'app/entities/attachment/attachment.model';
import { AttachmentService } from 'app/entities/attachment/service/attachment.service';

import { MedicalSurveyUpdateComponent } from './medical-survey-update.component';

describe('MedicalSurvey Management Update Component', () => {
  let comp: MedicalSurveyUpdateComponent;
  let fixture: ComponentFixture<MedicalSurveyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let medicalSurveyService: MedicalSurveyService;
  let attachmentService: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MedicalSurveyUpdateComponent],
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
      .overrideTemplate(MedicalSurveyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MedicalSurveyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    medicalSurveyService = TestBed.inject(MedicalSurveyService);
    attachmentService = TestBed.inject(AttachmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Attachment query and add missing value', () => {
      const medicalSurvey: IMedicalSurvey = { id: 456 };
      const attachment: IAttachment = { id: 63211 };
      medicalSurvey.attachment = attachment;

      const attachmentCollection: IAttachment[] = [{ id: 58526 }];
      jest.spyOn(attachmentService, 'query').mockReturnValue(of(new HttpResponse({ body: attachmentCollection })));
      const additionalAttachments = [attachment];
      const expectedCollection: IAttachment[] = [...additionalAttachments, ...attachmentCollection];
      jest.spyOn(attachmentService, 'addAttachmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ medicalSurvey });
      comp.ngOnInit();

      expect(attachmentService.query).toHaveBeenCalled();
      expect(attachmentService.addAttachmentToCollectionIfMissing).toHaveBeenCalledWith(attachmentCollection, ...additionalAttachments);
      expect(comp.attachmentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const medicalSurvey: IMedicalSurvey = { id: 456 };
      const attachment: IAttachment = { id: 7001 };
      medicalSurvey.attachment = attachment;

      activatedRoute.data = of({ medicalSurvey });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(medicalSurvey));
      expect(comp.attachmentsSharedCollection).toContain(attachment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MedicalSurvey>>();
      const medicalSurvey = { id: 123 };
      jest.spyOn(medicalSurveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicalSurvey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicalSurvey }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(medicalSurveyService.update).toHaveBeenCalledWith(medicalSurvey);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MedicalSurvey>>();
      const medicalSurvey = new MedicalSurvey();
      jest.spyOn(medicalSurveyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicalSurvey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: medicalSurvey }));
      saveSubject.complete();

      // THEN
      expect(medicalSurveyService.create).toHaveBeenCalledWith(medicalSurvey);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<MedicalSurvey>>();
      const medicalSurvey = { id: 123 };
      jest.spyOn(medicalSurveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ medicalSurvey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(medicalSurveyService.update).toHaveBeenCalledWith(medicalSurvey);
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
