import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Language } from 'app/entities/enumerations/language.model';
import { IPerson, Person } from '../person.model';

import { PersonService } from './person.service';

describe('Person Service', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  let elemDefault: IPerson;
  let expectedResult: IPerson | IPerson[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      personalIdentifier: 'AAAAAAA',
      identifierType: 'AAAAAAA',
      firstName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      email: 'AAAAAAA',
      phoneNumber: 'AAAAAAA',
      firstSpokenLanguage: Language.FRENCH,
      secondSpokenLanguage: Language.FRENCH,
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

    it('should create a Person', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Person()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Person', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          personalIdentifier: 'BBBBBB',
          identifierType: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          firstSpokenLanguage: 'BBBBBB',
          secondSpokenLanguage: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Person', () => {
      const patchObject = Object.assign(
        {
          identifierType: 'BBBBBB',
          lastName: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          firstSpokenLanguage: 'BBBBBB',
        },
        new Person()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Person', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          personalIdentifier: 'BBBBBB',
          identifierType: 'BBBBBB',
          firstName: 'BBBBBB',
          lastName: 'BBBBBB',
          email: 'BBBBBB',
          phoneNumber: 'BBBBBB',
          firstSpokenLanguage: 'BBBBBB',
          secondSpokenLanguage: 'BBBBBB',
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

    it('should delete a Person', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPersonToCollectionIfMissing', () => {
      it('should add a Person to an empty array', () => {
        const person: IPerson = { id: 123 };
        expectedResult = service.addPersonToCollectionIfMissing([], person);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(person);
      });

      it('should not add a Person to an array that contains it', () => {
        const person: IPerson = { id: 123 };
        const personCollection: IPerson[] = [
          {
            ...person,
          },
          { id: 456 },
        ];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, person);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Person to an array that doesn't contain it", () => {
        const person: IPerson = { id: 123 };
        const personCollection: IPerson[] = [{ id: 456 }];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, person);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(person);
      });

      it('should add only unique Person to an array', () => {
        const personArray: IPerson[] = [{ id: 123 }, { id: 456 }, { id: 98005 }];
        const personCollection: IPerson[] = [{ id: 123 }];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, ...personArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const person: IPerson = { id: 123 };
        const person2: IPerson = { id: 456 };
        expectedResult = service.addPersonToCollectionIfMissing([], person, person2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(person);
        expect(expectedResult).toContain(person2);
      });

      it('should accept null and undefined values', () => {
        const person: IPerson = { id: 123 };
        expectedResult = service.addPersonToCollectionIfMissing([], null, person, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(person);
      });

      it('should return initial array if no Person is added', () => {
        const personCollection: IPerson[] = [{ id: 123 }];
        expectedResult = service.addPersonToCollectionIfMissing(personCollection, undefined, null);
        expect(expectedResult).toEqual(personCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
