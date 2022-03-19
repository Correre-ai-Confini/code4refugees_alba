import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICheckPoint } from '../check-point.model';

@Component({
  selector: 'jhi-check-point-detail',
  templateUrl: './check-point-detail.component.html',
})
export class CheckPointDetailComponent implements OnInit {
  checkPoint: ICheckPoint | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ checkPoint }) => {
      this.checkPoint = checkPoint;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
