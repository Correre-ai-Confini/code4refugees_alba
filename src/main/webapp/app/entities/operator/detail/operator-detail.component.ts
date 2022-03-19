import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOperator } from '../operator.model';

@Component({
  selector: 'jhi-operator-detail',
  templateUrl: './operator-detail.component.html',
})
export class OperatorDetailComponent implements OnInit {
  operator: IOperator | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operator }) => {
      this.operator = operator;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
