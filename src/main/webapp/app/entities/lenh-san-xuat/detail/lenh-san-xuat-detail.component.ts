import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILenhSanXuat } from '../lenh-san-xuat.model';

@Component({
  selector: 'jhi-lenh-san-xuat-detail',
  templateUrl: './lenh-san-xuat-detail.component.html',
})
export class LenhSanXuatDetailComponent implements OnInit {
  lenhSanXuat: ILenhSanXuat | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lenhSanXuat }) => {
      this.lenhSanXuat = lenhSanXuat;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
