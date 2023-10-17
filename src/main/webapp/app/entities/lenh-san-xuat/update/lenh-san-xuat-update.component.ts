import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILenhSanXuat, LenhSanXuat } from '../lenh-san-xuat.model';
import { LenhSanXuatService } from '../service/lenh-san-xuat.service';

@Component({
  selector: 'jhi-lenh-san-xuat-update',
  templateUrl: './lenh-san-xuat-update.component.html',
})
export class LenhSanXuatUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    maLenhSanXuat: [null, [Validators.required]],
    entryTime: [],
    status: [],
    comment: [],
    sender: [],
    approver: [],
  });

  constructor(protected lenhSanXuatService: LenhSanXuatService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lenhSanXuat }) => {
      this.updateForm(lenhSanXuat);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lenhSanXuat = this.createFromForm();
    if (lenhSanXuat.id !== undefined) {
      this.subscribeToSaveResponse(this.lenhSanXuatService.update(lenhSanXuat));
    } else {
      this.subscribeToSaveResponse(this.lenhSanXuatService.create(lenhSanXuat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILenhSanXuat>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(lenhSanXuat: ILenhSanXuat): void {
    this.editForm.patchValue({
      id: lenhSanXuat.id,
      maLenhSanXuat: lenhSanXuat.maLenhSanXuat,
      entryTime: lenhSanXuat.entryTime,
      status: lenhSanXuat.status,
      comment: lenhSanXuat.comment,
      sender: lenhSanXuat.sender,
      approver: lenhSanXuat.approver,
    });
  }

  protected createFromForm(): ILenhSanXuat {
    return {
      ...new LenhSanXuat(),
      id: this.editForm.get(['id'])!.value,
      maLenhSanXuat: this.editForm.get(['maLenhSanXuat'])!.value,
      entryTime: this.editForm.get(['entryTime'])!.value,
      status: this.editForm.get(['status'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      sender: this.editForm.get(['sender'])!.value,
      approver: this.editForm.get(['approver'])!.value,
    };
  }
}
