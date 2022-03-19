import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CheckPointService } from '../service/check-point.service';

import { CheckPointComponent } from './check-point.component';

describe('CheckPoint Management Component', () => {
  let comp: CheckPointComponent;
  let fixture: ComponentFixture<CheckPointComponent>;
  let service: CheckPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CheckPointComponent],
    })
      .overrideTemplate(CheckPointComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CheckPointComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CheckPointService);

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
    expect(comp.checkPoints?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
