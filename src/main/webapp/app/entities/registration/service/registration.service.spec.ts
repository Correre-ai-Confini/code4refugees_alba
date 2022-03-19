import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRegistration, Registration } from '../registration.model';

import { RegistrationService } from './registration.service';

describe('Registration Service', () => {
  let service: RegistrationService;
  let httpMock: HttpTestingController;
  let elemDefault: IRegistration;
  let expectedResult: IRegistration | IRegistration[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RegistrationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      notes: 'AAAAAAA',
      timestamp: currentDate,
      legalConsentBlobContentType: 'image/png',
      legalConsentBlob: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Registration', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.create(new Registration()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Registration', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          legalConsentBlob: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Registration', () => {
      const patchObject = Object.assign(
        {
          timestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        new Registration()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Registration', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          notes: 'BBBBBB',
          timestamp: currentDate.format(DATE_TIME_FORMAT),
          legalConsentBlob: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          timestamp: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Registration', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRegistrationToCollectionIfMissing', () => {
      it('should add a Registration to an empty array', () => {
        const registration: IRegistration = { id: 123 };
        expectedResult = service.addRegistrationToCollectionIfMissing([], registration);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registration);
      });

      it('should not add a Registration to an array that contains it', () => {
        const registration: IRegistration = { id: 123 };
        const registrationCollection: IRegistration[] = [
          {
            ...registration,
          },
          { id: 456 },
        ];
        expectedResult = service.addRegistrationToCollectionIfMissing(registrationCollection, registration);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Registration to an array that doesn't contain it", () => {
        const registration: IRegistration = { id: 123 };
        const registrationCollection: IRegistration[] = [{ id: 456 }];
        expectedResult = service.addRegistrationToCollectionIfMissing(registrationCollection, registration);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registration);
      });

      it('should add only unique Registration to an array', () => {
        const registrationArray: IRegistration[] = [{ id: 123 }, { id: 456 }, { id: 7707 }];
        const registrationCollection: IRegistration[] = [{ id: 123 }];
        expectedResult = service.addRegistrationToCollectionIfMissing(registrationCollection, ...registrationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const registration: IRegistration = { id: 123 };
        const registration2: IRegistration = { id: 456 };
        expectedResult = service.addRegistrationToCollectionIfMissing([], registration, registration2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registration);
        expect(expectedResult).toContain(registration2);
      });

      it('should accept null and undefined values', () => {
        const registration: IRegistration = { id: 123 };
        expectedResult = service.addRegistrationToCollectionIfMissing([], null, registration, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registration);
      });

      it('should return initial array if no Registration is added', () => {
        const registrationCollection: IRegistration[] = [{ id: 123 }];
        expectedResult = service.addRegistrationToCollectionIfMissing(registrationCollection, undefined, null);
        expect(expectedResult).toEqual(registrationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
