import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEventType, EventType } from '../event-type.model';

import { EventTypeService } from './event-type.service';

describe('EventType Service', () => {
  let service: EventTypeService;
  let httpMock: HttpTestingController;
  let elemDefault: IEventType;
  let expectedResult: IEventType | IEventType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EventTypeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      description: 'AAAAAAA',
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

    it('should create a EventType', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EventType()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EventType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EventType', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
        },
        new EventType()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EventType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          description: 'BBBBBB',
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

    it('should delete a EventType', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEventTypeToCollectionIfMissing', () => {
      it('should add a EventType to an empty array', () => {
        const eventType: IEventType = { id: 123 };
        expectedResult = service.addEventTypeToCollectionIfMissing([], eventType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventType);
      });

      it('should not add a EventType to an array that contains it', () => {
        const eventType: IEventType = { id: 123 };
        const eventTypeCollection: IEventType[] = [
          {
            ...eventType,
          },
          { id: 456 },
        ];
        expectedResult = service.addEventTypeToCollectionIfMissing(eventTypeCollection, eventType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EventType to an array that doesn't contain it", () => {
        const eventType: IEventType = { id: 123 };
        const eventTypeCollection: IEventType[] = [{ id: 456 }];
        expectedResult = service.addEventTypeToCollectionIfMissing(eventTypeCollection, eventType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventType);
      });

      it('should add only unique EventType to an array', () => {
        const eventTypeArray: IEventType[] = [{ id: 123 }, { id: 456 }, { id: 24183 }];
        const eventTypeCollection: IEventType[] = [{ id: 123 }];
        expectedResult = service.addEventTypeToCollectionIfMissing(eventTypeCollection, ...eventTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const eventType: IEventType = { id: 123 };
        const eventType2: IEventType = { id: 456 };
        expectedResult = service.addEventTypeToCollectionIfMissing([], eventType, eventType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(eventType);
        expect(expectedResult).toContain(eventType2);
      });

      it('should accept null and undefined values', () => {
        const eventType: IEventType = { id: 123 };
        expectedResult = service.addEventTypeToCollectionIfMissing([], null, eventType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(eventType);
      });

      it('should return initial array if no EventType is added', () => {
        const eventTypeCollection: IEventType[] = [{ id: 123 }];
        expectedResult = service.addEventTypeToCollectionIfMissing(eventTypeCollection, undefined, null);
        expect(expectedResult).toEqual(eventTypeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
