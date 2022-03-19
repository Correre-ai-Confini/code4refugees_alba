import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPerson } from '../person.model';
import { PersonService } from '../service/person.service';
import { PersonDeleteDialogComponent } from '../delete/person-delete-dialog.component';

@Component({
  selector: 'jhi-person',
  templateUrl: './person.component.html',
})
export class PersonComponent implements OnInit {
  people?: IPerson[];
  isLoading = false;

  constructor(protected personService: PersonService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.personService.query().subscribe({
      next: (res: HttpResponse<IPerson[]>) => {
        this.isLoading = false;
        this.people = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPerson): number {
    return item.id!;
  }

  delete(person: IPerson): void {
    const modalRef = this.modalService.open(PersonDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.person = person;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
