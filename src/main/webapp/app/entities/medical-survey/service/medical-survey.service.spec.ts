import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMedicalSurvey, MedicalSurvey } from '../medical-survey.model';

import { MedicalSurveyService } from './medical-survey.service';

describe('MedicalSurvey Service', () => {
  let service: MedicalSurveyService;
  let httpMock: HttpTestingController;
  let elemDefault: IMedicalSurvey;
  let expectedResult: IMedicalSurvey | IMedicalSurvey[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MedicalSurveyService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      ongoingIllnesses: 'AAAAAAA',
      ongoingTreatments: 'AAAAAAA',
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

    it('should create a MedicalSurvey', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new MedicalSurvey()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MedicalSurvey', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ongoingIllnesses: 'BBBBBB',
          ongoingTreatments: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MedicalSurvey', () => {
      const patchObject = Object.assign({}, new MedicalSurvey());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MedicalSurvey', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ongoingIllnesses: 'BBBBBB',
          ongoingTreatments: 'BBBBBB',
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

    it('should delete a MedicalSurvey', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMedicalSurveyToCollectionIfMissing', () => {
      it('should add a MedicalSurvey to an empty array', () => {
        const medicalSurvey: IMedicalSurvey = { id: 123 };
        expectedResult = service.addMedicalSurveyToCollectionIfMissing([], medicalSurvey);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medicalSurvey);
      });

      it('should not add a MedicalSurvey to an array that contains it', () => {
        const medicalSurvey: IMedicalSurvey = { id: 123 };
        const medicalSurveyCollection: IMedicalSurvey[] = [
          {
            ...medicalSurvey,
          },
          { id: 456 },
        ];
        expectedResult = service.addMedicalSurveyToCollectionIfMissing(medicalSurveyCollection, medicalSurvey);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MedicalSurvey to an array that doesn't contain it", () => {
        const medicalSurvey: IMedicalSurvey = { id: 123 };
        const medicalSurveyCollection: IMedicalSurvey[] = [{ id: 456 }];
        expectedResult = service.addMedicalSurveyToCollectionIfMissing(medicalSurveyCollection, medicalSurvey);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medicalSurvey);
      });

      it('should add only unique MedicalSurvey to an array', () => {
        const medicalSurveyArray: IMedicalSurvey[] = [{ id: 123 }, { id: 456 }, { id: 8548 }];
        const medicalSurveyCollection: IMedicalSurvey[] = [{ id: 123 }];
        expectedResult = service.addMedicalSurveyToCollectionIfMissing(medicalSurveyCollection, ...medicalSurveyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const medicalSurvey: IMedicalSurvey = { id: 123 };
        const medicalSurvey2: IMedicalSurvey = { id: 456 };
        expectedResult = service.addMedicalSurveyToCollectionIfMissing([], medicalSurvey, medicalSurvey2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(medicalSurvey);
        expect(expectedResult).toContain(medicalSurvey2);
      });

      it('should accept null and undefined values', () => {
        const medicalSurvey: IMedicalSurvey = { id: 123 };
        expectedResult = service.addMedicalSurveyToCollectionIfMissing([], null, medicalSurvey, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(medicalSurvey);
      });

      it('should return initial array if no MedicalSurvey is added', () => {
        const medicalSurveyCollection: IMedicalSurvey[] = [{ id: 123 }];
        expectedResult = service.addMedicalSurveyToCollectionIfMissing(medicalSurveyCollection, undefined, null);
        expect(expectedResult).toEqual(medicalSurveyCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
