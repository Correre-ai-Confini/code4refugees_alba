import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILegalSurvey, LegalSurvey } from '../legal-survey.model';

import { LegalSurveyService } from './legal-survey.service';

describe('LegalSurvey Service', () => {
  let service: LegalSurveyService;
  let httpMock: HttpTestingController;
  let elemDefault: ILegalSurvey;
  let expectedResult: ILegalSurvey | ILegalSurvey[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LegalSurveyService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      notes: 'AAAAAAA',
      issues: 'AAAAAAA',
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

    it('should create a LegalSurvey', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new LegalSurvey()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LegalSurvey', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          issues: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LegalSurvey', () => {
      const patchObject = Object.assign(
        {
          notes: 'BBBBBB',
        },
        new LegalSurvey()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LegalSurvey', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          issues: 'BBBBBB',
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

    it('should delete a LegalSurvey', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLegalSurveyToCollectionIfMissing', () => {
      it('should add a LegalSurvey to an empty array', () => {
        const legalSurvey: ILegalSurvey = { id: 123 };
        expectedResult = service.addLegalSurveyToCollectionIfMissing([], legalSurvey);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(legalSurvey);
      });

      it('should not add a LegalSurvey to an array that contains it', () => {
        const legalSurvey: ILegalSurvey = { id: 123 };
        const legalSurveyCollection: ILegalSurvey[] = [
          {
            ...legalSurvey,
          },
          { id: 456 },
        ];
        expectedResult = service.addLegalSurveyToCollectionIfMissing(legalSurveyCollection, legalSurvey);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LegalSurvey to an array that doesn't contain it", () => {
        const legalSurvey: ILegalSurvey = { id: 123 };
        const legalSurveyCollection: ILegalSurvey[] = [{ id: 456 }];
        expectedResult = service.addLegalSurveyToCollectionIfMissing(legalSurveyCollection, legalSurvey);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(legalSurvey);
      });

      it('should add only unique LegalSurvey to an array', () => {
        const legalSurveyArray: ILegalSurvey[] = [{ id: 123 }, { id: 456 }, { id: 63406 }];
        const legalSurveyCollection: ILegalSurvey[] = [{ id: 123 }];
        expectedResult = service.addLegalSurveyToCollectionIfMissing(legalSurveyCollection, ...legalSurveyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const legalSurvey: ILegalSurvey = { id: 123 };
        const legalSurvey2: ILegalSurvey = { id: 456 };
        expectedResult = service.addLegalSurveyToCollectionIfMissing([], legalSurvey, legalSurvey2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(legalSurvey);
        expect(expectedResult).toContain(legalSurvey2);
      });

      it('should accept null and undefined values', () => {
        const legalSurvey: ILegalSurvey = { id: 123 };
        expectedResult = service.addLegalSurveyToCollectionIfMissing([], null, legalSurvey, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(legalSurvey);
      });

      it('should return initial array if no LegalSurvey is added', () => {
        const legalSurveyCollection: ILegalSurvey[] = [{ id: 123 }];
        expectedResult = service.addLegalSurveyToCollectionIfMissing(legalSurveyCollection, undefined, null);
        expect(expectedResult).toEqual(legalSurveyCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
