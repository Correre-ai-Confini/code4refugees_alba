import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICheckPoint, CheckPoint } from '../check-point.model';

import { CheckPointService } from './check-point.service';

describe('CheckPoint Service', () => {
  let service: CheckPointService;
  let httpMock: HttpTestingController;
  let elemDefault: ICheckPoint;
  let expectedResult: ICheckPoint | ICheckPoint[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CheckPointService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      friendlyname: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a CheckPoint', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CheckPoint()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CheckPoint', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          friendlyname: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CheckPoint', () => {
      const patchObject = Object.assign({}, new CheckPoint());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CheckPoint', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          friendlyname: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a CheckPoint', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCheckPointToCollectionIfMissing', () => {
      it('should add a CheckPoint to an empty array', () => {
        const checkPoint: ICheckPoint = { id: 123 };
        expectedResult = service.addCheckPointToCollectionIfMissing([], checkPoint);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkPoint);
      });

      it('should not add a CheckPoint to an array that contains it', () => {
        const checkPoint: ICheckPoint = { id: 123 };
        const checkPointCollection: ICheckPoint[] = [
          {
            ...checkPoint,
          },
          { id: 456 },
        ];
        expectedResult = service.addCheckPointToCollectionIfMissing(checkPointCollection, checkPoint);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CheckPoint to an array that doesn't contain it", () => {
        const checkPoint: ICheckPoint = { id: 123 };
        const checkPointCollection: ICheckPoint[] = [{ id: 456 }];
        expectedResult = service.addCheckPointToCollectionIfMissing(checkPointCollection, checkPoint);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkPoint);
      });

      it('should add only unique CheckPoint to an array', () => {
        const checkPointArray: ICheckPoint[] = [{ id: 123 }, { id: 456 }, { id: 35937 }];
        const checkPointCollection: ICheckPoint[] = [{ id: 123 }];
        expectedResult = service.addCheckPointToCollectionIfMissing(checkPointCollection, ...checkPointArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const checkPoint: ICheckPoint = { id: 123 };
        const checkPoint2: ICheckPoint = { id: 456 };
        expectedResult = service.addCheckPointToCollectionIfMissing([], checkPoint, checkPoint2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(checkPoint);
        expect(expectedResult).toContain(checkPoint2);
      });

      it('should accept null and undefined values', () => {
        const checkPoint: ICheckPoint = { id: 123 };
        expectedResult = service.addCheckPointToCollectionIfMissing([], null, checkPoint, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(checkPoint);
      });

      it('should return initial array if no CheckPoint is added', () => {
        const checkPointCollection: ICheckPoint[] = [{ id: 123 }];
        expectedResult = service.addCheckPointToCollectionIfMissing(checkPointCollection, undefined, null);
        expect(expectedResult).toEqual(checkPointCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
