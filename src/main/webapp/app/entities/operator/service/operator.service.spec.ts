import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { KindOfOperator } from 'app/entities/enumerations/kind-of-operator.model';
import { IOperator, Operator } from '../operator.model';

import { OperatorService } from './operator.service';

describe('Operator Service', () => {
  let service: OperatorService;
  let httpMock: HttpTestingController;
  let elemDefault: IOperator;
  let expectedResult: IOperator | IOperator[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OperatorService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      kindOfOperator: KindOfOperator.MEDICAL_DOCTOR,
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

    it('should create a Operator', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Operator()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Operator', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          kindOfOperator: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Operator', () => {
      const patchObject = Object.assign({}, new Operator());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Operator', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          kindOfOperator: 'BBBBBB',
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

    it('should delete a Operator', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addOperatorToCollectionIfMissing', () => {
      it('should add a Operator to an empty array', () => {
        const operator: IOperator = { id: 123 };
        expectedResult = service.addOperatorToCollectionIfMissing([], operator);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operator);
      });

      it('should not add a Operator to an array that contains it', () => {
        const operator: IOperator = { id: 123 };
        const operatorCollection: IOperator[] = [
          {
            ...operator,
          },
          { id: 456 },
        ];
        expectedResult = service.addOperatorToCollectionIfMissing(operatorCollection, operator);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Operator to an array that doesn't contain it", () => {
        const operator: IOperator = { id: 123 };
        const operatorCollection: IOperator[] = [{ id: 456 }];
        expectedResult = service.addOperatorToCollectionIfMissing(operatorCollection, operator);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operator);
      });

      it('should add only unique Operator to an array', () => {
        const operatorArray: IOperator[] = [{ id: 123 }, { id: 456 }, { id: 17398 }];
        const operatorCollection: IOperator[] = [{ id: 123 }];
        expectedResult = service.addOperatorToCollectionIfMissing(operatorCollection, ...operatorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const operator: IOperator = { id: 123 };
        const operator2: IOperator = { id: 456 };
        expectedResult = service.addOperatorToCollectionIfMissing([], operator, operator2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operator);
        expect(expectedResult).toContain(operator2);
      });

      it('should accept null and undefined values', () => {
        const operator: IOperator = { id: 123 };
        expectedResult = service.addOperatorToCollectionIfMissing([], null, operator, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operator);
      });

      it('should return initial array if no Operator is added', () => {
        const operatorCollection: IOperator[] = [{ id: 123 }];
        expectedResult = service.addOperatorToCollectionIfMissing(operatorCollection, undefined, null);
        expect(expectedResult).toEqual(operatorCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
