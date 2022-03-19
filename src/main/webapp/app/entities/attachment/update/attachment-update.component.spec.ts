import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AttachmentService } from '../service/attachment.service';
import { IAttachment, Attachment } from '../attachment.model';
import { IAttachmentCategory } from 'app/entities/attachment-category/attachment-category.model';
import { AttachmentCategoryService } from 'app/entities/attachment-category/service/attachment-category.service';
import { IRefugee } from 'app/entities/refugee/refugee.model';
import { RefugeeService } from 'app/entities/refugee/service/refugee.service';
import { IOperator } from 'app/entities/operator/operator.model';
import { OperatorService } from 'app/entities/operator/service/operator.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { AttachmentUpdateComponent } from './attachment-update.component';

describe('Attachment Management Update Component', () => {
  let comp: AttachmentUpdateComponent;
  let fixture: ComponentFixture<AttachmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attachmentService: AttachmentService;
  let attachmentCategoryService: AttachmentCategoryService;
  let refugeeService: RefugeeService;
  let operatorService: OperatorService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AttachmentUpdateComponent],
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
      .overrideTemplate(AttachmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttachmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attachmentService = TestBed.inject(AttachmentService);
    attachmentCategoryService = TestBed.inject(AttachmentCategoryService);
    refugeeService = TestBed.inject(RefugeeService);
    operatorService = TestBed.inject(OperatorService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AttachmentCategory query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const category: IAttachmentCategory = { id: 54856 };
      attachment.category = category;

      const attachmentCategoryCollection: IAttachmentCategory[] = [{ id: 58680 }];
      jest.spyOn(attachmentCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: attachmentCategoryCollection })));
      const additionalAttachmentCategories = [category];
      const expectedCollection: IAttachmentCategory[] = [...additionalAttachmentCategories, ...attachmentCategoryCollection];
      jest.spyOn(attachmentCategoryService, 'addAttachmentCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(attachmentCategoryService.query).toHaveBeenCalled();
      expect(attachmentCategoryService.addAttachmentCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        attachmentCategoryCollection,
        ...additionalAttachmentCategories
      );
      expect(comp.attachmentCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Refugee query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const refugee: IRefugee = { id: 26964 };
      attachment.refugee = refugee;

      const refugeeCollection: IRefugee[] = [{ id: 50134 }];
      jest.spyOn(refugeeService, 'query').mockReturnValue(of(new HttpResponse({ body: refugeeCollection })));
      const additionalRefugees = [refugee];
      const expectedCollection: IRefugee[] = [...additionalRefugees, ...refugeeCollection];
      jest.spyOn(refugeeService, 'addRefugeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(refugeeService.query).toHaveBeenCalled();
      expect(refugeeService.addRefugeeToCollectionIfMissing).toHaveBeenCalledWith(refugeeCollection, ...additionalRefugees);
      expect(comp.refugeesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Operator query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const creator: IOperator = { id: 3975 };
      attachment.creator = creator;

      const operatorCollection: IOperator[] = [{ id: 37091 }];
      jest.spyOn(operatorService, 'query').mockReturnValue(of(new HttpResponse({ body: operatorCollection })));
      const additionalOperators = [creator];
      const expectedCollection: IOperator[] = [...additionalOperators, ...operatorCollection];
      jest.spyOn(operatorService, 'addOperatorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(operatorService.query).toHaveBeenCalled();
      expect(operatorService.addOperatorToCollectionIfMissing).toHaveBeenCalledWith(operatorCollection, ...additionalOperators);
      expect(comp.operatorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const originalRegistrationRecord: IEvent = { id: 95642 };
      attachment.originalRegistrationRecord = originalRegistrationRecord;

      const eventCollection: IEvent[] = [{ id: 49413 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [originalRegistrationRecord];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(eventCollection, ...additionalEvents);
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attachment: IAttachment = { id: 456 };
      const category: IAttachmentCategory = { id: 11532 };
      attachment.category = category;
      const refugee: IRefugee = { id: 57469 };
      attachment.refugee = refugee;
      const creator: IOperator = { id: 68384 };
      attachment.creator = creator;
      const originalRegistrationRecord: IEvent = { id: 95766 };
      attachment.originalRegistrationRecord = originalRegistrationRecord;

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(attachment));
      expect(comp.attachmentCategoriesSharedCollection).toContain(category);
      expect(comp.refugeesSharedCollection).toContain(refugee);
      expect(comp.operatorsSharedCollection).toContain(creator);
      expect(comp.eventsSharedCollection).toContain(originalRegistrationRecord);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Attachment>>();
      const attachment = { id: 123 };
      jest.spyOn(attachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attachment }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(attachmentService.update).toHaveBeenCalledWith(attachment);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Attachment>>();
      const attachment = new Attachment();
      jest.spyOn(attachmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attachment }));
      saveSubject.complete();

      // THEN
      expect(attachmentService.create).toHaveBeenCalledWith(attachment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Attachment>>();
      const attachment = { id: 123 };
      jest.spyOn(attachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attachmentService.update).toHaveBeenCalledWith(attachment);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAttachmentCategoryById', () => {
      it('Should return tracked AttachmentCategory primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAttachmentCategoryById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackRefugeeById', () => {
      it('Should return tracked Refugee primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRefugeeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackOperatorById', () => {
      it('Should return tracked Operator primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackOperatorById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackEventById', () => {
      it('Should return tracked Event primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEventById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
