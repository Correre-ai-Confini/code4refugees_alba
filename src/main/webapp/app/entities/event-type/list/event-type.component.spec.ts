import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EventTypeService } from '../service/event-type.service';

import { EventTypeComponent } from './event-type.component';

describe('EventType Management Component', () => {
  let comp: EventTypeComponent;
  let fixture: ComponentFixture<EventTypeComponent>;
  let service: EventTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EventTypeComponent],
    })
      .overrideTemplate(EventTypeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventTypeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventTypeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.eventTypes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
