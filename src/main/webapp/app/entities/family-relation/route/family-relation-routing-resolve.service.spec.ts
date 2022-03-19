import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IFamilyRelation, FamilyRelation } from '../family-relation.model';
import { FamilyRelationService } from '../service/family-relation.service';

import { FamilyRelationRoutingResolveService } from './family-relation-routing-resolve.service';

describe('FamilyRelation routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FamilyRelationRoutingResolveService;
  let service: FamilyRelationService;
  let resultFamilyRelation: IFamilyRelation | undefined;

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
    routingResolveService = TestBed.inject(FamilyRelationRoutingResolveService);
    service = TestBed.inject(FamilyRelationService);
    resultFamilyRelation = undefined;
  });

  describe('resolve', () => {
    it('should return IFamilyRelation returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFamilyRelation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFamilyRelation).toEqual({ id: 123 });
    });

    it('should return new IFamilyRelation if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFamilyRelation = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFamilyRelation).toEqual(new FamilyRelation());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as FamilyRelation })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFamilyRelation = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFamilyRelation).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
