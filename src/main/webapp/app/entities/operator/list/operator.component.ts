import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IOperator } from '../operator.model';
import { OperatorService } from '../service/operator.service';
import { OperatorDeleteDialogComponent } from '../delete/operator-delete-dialog.component';

@Component({
  selector: 'jhi-operator',
  templateUrl: './operator.component.html',
})
export class OperatorComponent implements OnInit {
  operators?: IOperator[];
  isLoading = false;

  constructor(protected operatorService: OperatorService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.operatorService.query().subscribe({
      next: (res: HttpResponse<IOperator[]>) => {
        this.isLoading = false;
        this.operators = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IOperator): number {
    return item.id!;
  }

  delete(operator: IOperator): void {
    const modalRef = this.modalService.open(OperatorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.operator = operator;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
