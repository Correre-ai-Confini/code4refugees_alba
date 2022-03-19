import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RefugeeService } from '../service/refugee.service';

import { RefugeeComponent } from './refugee.component';

describe('Refugee Management Component', () => {
  let comp: RefugeeComponent;
  let fixture: ComponentFixture<RefugeeComponent>;
  let service: RefugeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [RefugeeComponent],
    })
      .overrideTemplate(RefugeeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RefugeeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(RefugeeService);

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
    expect(comp.refugees?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
