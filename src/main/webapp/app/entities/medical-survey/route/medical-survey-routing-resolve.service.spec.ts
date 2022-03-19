import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IMedicalSurvey, MedicalSurvey } from '../medical-survey.model';
import { MedicalSurveyService } from '../service/medical-survey.service';

import { MedicalSurveyRoutingResolveService } from './medical-survey-routing-resolve.service';

describe('MedicalSurvey routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: MedicalSurveyRoutingResolveService;
  let service: MedicalSurveyService;
  let resultMedicalSurvey: IMedicalSurvey | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(MedicalSurveyRoutingResolveService);
    service = TestBed.inject(MedicalSurveyService);
    resultMedicalSurvey = undefined;
  });

  describe('resolve', () => {
    it('should return IMedicalSurvey returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMedicalSurvey = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMedicalSurvey).toEqual({ id: 123 });
    });

    it('should return new IMedicalSurvey if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMedicalSurvey = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultMedicalSurvey).toEqual(new MedicalSurvey());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as MedicalSurvey })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultMedicalSurvey = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultMedicalSurvey).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
