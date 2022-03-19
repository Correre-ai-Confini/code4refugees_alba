import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IAttachmentCategory, AttachmentCategory } from '../attachment-category.model';
import { AttachmentCategoryService } from '../service/attachment-category.service';

import { AttachmentCategoryRoutingResolveService } from './attachment-category-routing-resolve.service';

describe('AttachmentCategory routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: AttachmentCategoryRoutingResolveService;
  let service: AttachmentCategoryService;
  let resultAttachmentCategory: IAttachmentCategory | undefined;

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
    routingResolveService = TestBed.inject(AttachmentCategoryRoutingResolveService);
    service = TestBed.inject(AttachmentCategoryService);
    resultAttachmentCategory = undefined;
  });

  describe('resolve', () => {
    it('should return IAttachmentCategory returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAttachmentCategory = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAttachmentCategory).toEqual({ id: 123 });
    });

    it('should return new IAttachmentCategory if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAttachmentCategory = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultAttachmentCategory).toEqual(new AttachmentCategory());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as AttachmentCategory })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultAttachmentCategory = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultAttachmentCategory).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
