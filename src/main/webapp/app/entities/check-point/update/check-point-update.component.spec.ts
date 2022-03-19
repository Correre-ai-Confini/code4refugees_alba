import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CheckPointService } from '../service/check-point.service';
import { ICheckPoint, CheckPoint } from '../check-point.model';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { CheckPointUpdateComponent } from './check-point-update.component';

describe('CheckPoint Management Update Component', () => {
  let comp: CheckPointUpdateComponent;
  let fixture: ComponentFixture<CheckPointUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let checkPointService: CheckPointService;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CheckPointUpdateComponent],
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
      .overrideTemplate(CheckPointUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CheckPointUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    checkPointService = TestBed.inject(CheckPointService);
    locationService = TestBed.inject(LocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call location query and add missing value', () => {
      const checkPoint: ICheckPoint = { id: 456 };
      const location: ILocation = { id: 46792 };
      checkPoint.location = location;

      const locationCollection: ILocation[] = [{ id: 55868 }];
      jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: ILocation[] = [location, ...locationCollection];
      jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ checkPoint });
      comp.ngOnInit();

      expect(locationService.query).toHaveBeenCalled();
      expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const checkPoint: ICheckPoint = { id: 456 };
      const location: ILocation = { id: 2958 };
      checkPoint.location = location;

      activatedRoute.data = of({ checkPoint });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(checkPoint));
      expect(comp.locationsCollection).toContain(location);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CheckPoint>>();
      const checkPoint = { id: 123 };
      jest.spyOn(checkPointService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkPoint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkPoint }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(checkPointService.update).toHaveBeenCalledWith(checkPoint);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CheckPoint>>();
      const checkPoint = new CheckPoint();
      jest.spyOn(checkPointService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkPoint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: checkPoint }));
      saveSubject.complete();

      // THEN
      expect(checkPointService.create).toHaveBeenCalledWith(checkPoint);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CheckPoint>>();
      const checkPoint = { id: 123 };
      jest.spyOn(checkPointService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ checkPoint });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(checkPointService.update).toHaveBeenCalledWith(checkPoint);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLocationById', () => {
      it('Should return tracked Location primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLocationById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
