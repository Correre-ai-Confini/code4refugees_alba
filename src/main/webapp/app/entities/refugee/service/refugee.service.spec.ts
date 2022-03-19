import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Edulevel } from 'app/entities/enumerations/edulevel.model';
import { Religion } from 'app/entities/enumerations/religion.model';
import { Gender } from 'app/entities/enumerations/gender.model';
import { IRefugee, Refugee } from '../refugee.model';

import { RefugeeService } from './refugee.service';

describe('Refugee Service', () => {
  let service: RefugeeService;
  let httpMock: HttpTestingController;
  let elemDefault: IRefugee;
  let expectedResult: IRefugee | IRefugee[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RefugeeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      qrcodeUUID: 'AAAAAAA',
      educationalLevel: Edulevel.NO_SCHOOL,
      mandatoryTutored: false,
      birthDate: currentDate,
      disabledPerson: false,
      religion: Religion.CHRISTIAN,
      gender: Gender.M,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          birthDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Refugee', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          birthDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Refugee()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Refugee', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          qrcodeUUID: 'BBBBBB',
          educationalLevel: 'BBBBBB',
          mandatoryTutored: true,
          birthDate: currentDate.format(DATE_FORMAT),
          disabledPerson: true,
          religion: 'BBBBBB',
          gender: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Refugee', () => {
      const patchObject = Object.assign(
        {
          educationalLevel: 'BBBBBB',
          mandatoryTutored: true,
          disabledPerson: true,
          religion: 'BBBBBB',
        },
        new Refugee()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Refugee', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          qrcodeUUID: 'BBBBBB',
          educationalLevel: 'BBBBBB',
          mandatoryTutored: true,
          birthDate: currentDate.format(DATE_FORMAT),
          disabledPerson: true,
          religion: 'BBBBBB',
          gender: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Refugee', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRefugeeToCollectionIfMissing', () => {
      it('should add a Refugee to an empty array', () => {
        const refugee: IRefugee = { id: 123 };
        expectedResult = service.addRefugeeToCollectionIfMissing([], refugee);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(refugee);
      });

      it('should not add a Refugee to an array that contains it', () => {
        const refugee: IRefugee = { id: 123 };
        const refugeeCollection: IRefugee[] = [
          {
            ...refugee,
          },
          { id: 456 },
        ];
        expectedResult = service.addRefugeeToCollectionIfMissing(refugeeCollection, refugee);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Refugee to an array that doesn't contain it", () => {
        const refugee: IRefugee = { id: 123 };
        const refugeeCollection: IRefugee[] = [{ id: 456 }];
        expectedResult = service.addRefugeeToCollectionIfMissing(refugeeCollection, refugee);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(refugee);
      });

      it('should add only unique Refugee to an array', () => {
        const refugeeArray: IRefugee[] = [{ id: 123 }, { id: 456 }, { id: 50707 }];
        const refugeeCollection: IRefugee[] = [{ id: 123 }];
        expectedResult = service.addRefugeeToCollectionIfMissing(refugeeCollection, ...refugeeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const refugee: IRefugee = { id: 123 };
        const refugee2: IRefugee = { id: 456 };
        expectedResult = service.addRefugeeToCollectionIfMissing([], refugee, refugee2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(refugee);
        expect(expectedResult).toContain(refugee2);
      });

      it('should accept null and undefined values', () => {
        const refugee: IRefugee = { id: 123 };
        expectedResult = service.addRefugeeToCollectionIfMissing([], null, refugee, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(refugee);
      });

      it('should return initial array if no Refugee is added', () => {
        const refugeeCollection: IRefugee[] = [{ id: 123 }];
        expectedResult = service.addRefugeeToCollectionIfMissing(refugeeCollection, undefined, null);
        expect(expectedResult).toEqual(refugeeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
