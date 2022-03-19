import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRefugee } from '../refugee.model';

@Component({
  selector: 'jhi-refugee-detail',
  templateUrl: './refugee-detail.component.html',
})
export class RefugeeDetailComponent implements OnInit {
  refugee: IRefugee | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ refugee }) => {
      this.refugee = refugee;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
