import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EventTypeService } from '../service/event-type.service';
import { IEventType, EventType } from '../event-type.model';

import { EventTypeUpdateComponent } from './event-type-update.component';

describe('EventType Management Update Component', () => {
  let comp: EventTypeUpdateComponent;
  let fixture: ComponentFixture<EventTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eventTypeService: EventTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EventTypeUpdateComponent],
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
      .overrideTemplate(EventTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eventTypeService = TestBed.inject(EventTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const eventType: IEventType = { id: 456 };

      activatedRoute.data = of({ eventType });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(eventType));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventType>>();
      const eventType = { id: 123 };
      jest.spyOn(eventTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventType }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(eventTypeService.update).toHaveBeenCalledWith(eventType);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventType>>();
      const eventType = new EventType();
      jest.spyOn(eventTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: eventType }));
      saveSubject.complete();

      // THEN
      expect(eventTypeService.create).toHaveBeenCalledWith(eventType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EventType>>();
      const eventType = { id: 123 };
      jest.spyOn(eventTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ eventType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eventTypeService.update).toHaveBeenCalledWith(eventType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
