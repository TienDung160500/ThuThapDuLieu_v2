import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { IChiTietKichBan } from 'app/entities/chi-tiet-kich-ban/chi-tiet-kich-ban.model';
import { IThietBi } from 'app/entities/thiet-bi/thiet-bi.model';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISanXuatHangNgay, SanXuatHangNgay } from '../san-xuat-hang-ngay.model';
import { SanXuatHangNgayService } from '../service/san-xuat-hang-ngay.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IKichBan } from 'app/entities/kich-ban/kich-ban.model';
import { IQuanLyThongSo } from 'app/entities/quan-ly-thong-so/quan-ly-thong-so.model';

@Component({
  selector: 'jhi-san-xuat-hang-ngay-update',
  templateUrl: './san-xuat-hang-ngay-update.component.html',
  styleUrls: ['./san-xuat-hang-ngay-update.component.css'],
})
export class SanXuatHangNgayUpdateComponent implements OnInit {
  //------------------- url lay danh sach thong so theo mã kịch bản --------------------
  kichBanUrl = this.applicationConfigService.getEndpointFor('api/kich-ban/thong-so-kich-ban/ma-kich-ban');
  // ----------------- url luu thong so kich ban theo mã kịch bản -----------------------
  chiTietSanXuatUrl = this.applicationConfigService.getEndpointFor('api/san-xuat-hang-ngay/them-moi-thong-so-san-xuat');
  // ------------------- url lay thong tin kich ban theo ma kich ban ----------------------
  kichBanUrl1 = this.applicationConfigService.getEndpointFor('api/kich-ban/chi-tiet-kich-ban-ma-kich-ban');
  listThongSoUrl = this.applicationConfigService.getEndpointFor('api/quan-ly-thong-so');
  listThietBiUrl = this.applicationConfigService.getEndpointFor('api/thiet-bi');
  listNhomThietBiUrl = this.applicationConfigService.getEndpointFor('api/nhom-thiet-bi');
  getChiTietSanXuatUrl = this.applicationConfigService.getEndpointFor('api/san-xuat-hang-ngay/chi-tiet-san-xuat');
  putChiTietSanXuatUrl = this.applicationConfigService.getEndpointFor('api/san-xuat-hang-ngay/cap-nhat');
  donViUrl = this.applicationConfigService.getEndpointFor('api/don-vi');
  getKichBanUrl = this.applicationConfigService.getEndpointFor('api/kich-ban');
  listDayChuyenUrl = this.applicationConfigService.getEndpointFor('api/day-chuyen');
  delUrl = this.applicationConfigService.getEndpointFor('api/san-xuat-hang-ngay/del-thong-so');

  selectedStatus = 'active';

  isSaving = false;
  predicate!: string;
  ascending!: boolean;

  account: Account | null = null;

  public showSuccessPopupService = false;
  public showSuccessPopup = false;

  result?: string;
  resultThongSo?: string;

  @Input() color = 'blue';

  //--------------------------------------------- khoi tao input thong so kich ban
  @Input() idKichBan = '';
  @Input() maKichBan = '';
  @Input() thongSo = '';
  @Input() minValue = '';
  @Input() maxValue = '';
  @Input() trungBinh = '';
  @Input() donVi = '';
  @Input() phanLoai = '';
  //----------------------------------------- khoi tao input kich ban sản xuất hàng ngày
  @Input() maThietBi?: string | null | undefined = '';
  @Input() loaiThietBi = '';
  @Input() dayChuyen?: string | null | undefined = '';
  @Input() maSanPham?: string | null | undefined = '';
  @Input() versionSanPham?: string | null | undefined = '';
  @Input() trangThai = '';
  idSanXuatHangNgay: number | null | undefined;
  thietBisSharedCollection: IThietBi[] = [];
  //------------------ nơi lưu danh sách thông số - danh sách thiết bị --------------------
  listOfThongSo: IQuanLyThongSo[] = [];
  listOfThietBi: IThietBi[] = [];
  listNhomThietBi: { loaiThietBi: string; maThietBi: string; dayChuyen: string }[] = [];
  listDonVi: { donVi: string }[] = [];
  listKichBan: { maKichBan: string }[] = [];

  // ------------------ lưu tìm kiếm theo loại thiết bị ---------------
  listMaThietBi: { maThietBi: string }[] = [];
  listDayChuyen: { dayChuyen: string }[] = [];

  listOfChiTietKichBan: {
    id: number;
    idSanXuatHangNgay: number | null | undefined;
    maKichBan: string | null | undefined;
    thongSo: string | null | undefined;
    minValue: number | null | undefined;
    maxValue: number | null | undefined;
    trungbinh: number | null | undefined;
    donVi: string | null | undefined;
  }[] = [];
  editForm = this.fb.group({
    id: [],
    maKichBan: [],
    maThietBi: [],
    loaiThietBi: [],
    dayChuyen: [],
    maSanPham: [],
    versionSanPham: [],
    ngayTao: [],
    timeUpdate: [],
    trangThai: [],
  });

  constructor(
    protected sanXuatHangNgayService: SanXuatHangNgayService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sanXuatHangNgay }) => {
      this.getAllDonVi();
      this.getAllKichBan();
      this.getAllDayChuyen();
      this.getAllThongSo();
      this.getAllThietBi();
      this.getAllNhomThietBi();
      if (sanXuatHangNgay.id === undefined) {
        const today = dayjs().startOf('minute');
        sanXuatHangNgay.ngayTao = today;
        sanXuatHangNgay.timeUpdate = today;
      } else {
        this.idSanXuatHangNgay = sanXuatHangNgay.id;
        this.maThietBi = sanXuatHangNgay.maThietBi;
        this.dayChuyen = sanXuatHangNgay.dayChuyen;
        this.maSanPham = sanXuatHangNgay.maSanPham;
        this.versionSanPham = sanXuatHangNgay.versionSanPham;
        this.loaiThietBi = sanXuatHangNgay.loaiThietBi;
        const today = dayjs().startOf('minute');
        sanXuatHangNgay.timeUpdate = today;
        //Lấy danh sách thông số thiết bị theo id
        this.http.get<any>(`${this.getChiTietSanXuatUrl}/${sanXuatHangNgay.id as number}`).subscribe(res => {
          this.listOfChiTietKichBan = res;
          //gán idThietBi cho list
          for (let i = 0; i < this.listOfChiTietKichBan.length; i++) {
            this.listOfChiTietKichBan[i].idSanXuatHangNgay = sanXuatHangNgay.id;
          }

          // console.log("san xuat hang ngay:", this.listOfChiTietKichBan)
          // console.log("id kich ban:",kichBan.id)
        });
      }
      this.updateForm(sanXuatHangNgay);
    });
  }
  //==================================================== Lấy danh sách =================================================
  getAllThongSo(): void {
    this.http.get<IQuanLyThongSo>(this.listThongSoUrl).subscribe(res => {
      this.listOfThongSo = res as any;
      // console.log("danh sach thong so: ", this.listOfThongSo);
    });
  }
  getAllThietBi(): void {
    this.http.get<IThietBi>(this.listThietBiUrl).subscribe(res => {
      this.listOfThietBi = res as any;
      // console.log("danh sach thiet bi: ", this.listOfThietBi);
    });
  }
  getAllNhomThietBi(): void {
    this.http.get<any>(this.listNhomThietBiUrl).subscribe(res => {
      this.listNhomThietBi = res;
      console.log('nhom thiet bi:', this.listNhomThietBi);
    });
  }
  getAllDonVi(): void {
    this.http.get<any>(this.donViUrl).subscribe(res => {
      this.listDonVi = res;
      // console.log("don vi:", this.listDonVi);
    });
  }
  getAllKichBan(): void {
    this.http.get<any>(this.getKichBanUrl).subscribe(res => {
      this.listKichBan = res;
      // console.log("kich ban:", this.listKichBan)
    });
  }
  getAllDayChuyen(): void {
    this.http.get<any>(this.listDayChuyenUrl).subscribe(res => {
      this.listDayChuyen = res;
      // console.log("day chuyen: ", this.listDayChuyen);
    });
  }
  getMaThietBi(maTB: string | undefined | null): void {
    // console.log('ma thiet bi:',this.listNhomThietBi)
    console.log('loai thiet bi', maTB);
    for (let i = 0; i < this.listNhomThietBi.length; i++) {
      if (maTB === this.listNhomThietBi[i].loaiThietBi) {
        const items = { maThietBi: this.listNhomThietBi[i].maThietBi };
        this.listMaThietBi.push(items);
      }
    }
  }
  //------------------------------ lay thong tin kịch bản, chi tiết kịch bản thông qua mã kịch bản ------------------------------
  getChiTietKichBan(): void {
    //---------- lay thong tin kich ban -------------
    this.http
      .get<IKichBan>(`${this.kichBanUrl1}/${this.editForm.get(['maKichBan'])!.value as number}`)
      .subscribe((res: ISanXuatHangNgay) => {
        //---------------------------------- Set thông tin tương ứng theo loại thiết bị-----------------------------
        //lay thong tin chi tiet kich ban
        this.getMaThietBi(res.loaiThietBi);
        console.log('hello', this.listNhomThietBi);
        // set thông tin kịch bản để hiển thị
        this.dayChuyen = res.dayChuyen;
        this.maSanPham = res.maSanPham;
        this.versionSanPham = res.versionSanPham;
        // set thông tin kịch bản để thêm mới
        this.editForm.patchValue({
          maThietBi: res.maThietBi,
          loaiThietBi: res.loaiThietBi,
          dayChuyen: res.dayChuyen,
          maSanPham: res.maSanPham,
          versionSanPham: res.versionSanPham,
          trangThai: res.trangThai,
        });
      });
    //lay thong tin chi tiet kich ban
    this.http.get<IChiTietKichBan[]>(`${this.kichBanUrl}/${this.editForm.get(['maKichBan'])!.value as number}`).subscribe(res => {
      for (let i = 0; i < res.length; i++) {
        const newRow = {
          id: 0,
          idSanXuatHangNgay: undefined,
          maKichBan: res[i].maKichBan,
          thongSo: res[i].thongSo,
          minValue: res[i].minValue,
          maxValue: res[i].maxValue,
          trungbinh: res[i].trungbinh,
          donVi: res[i].donVi,
        };
        this.listOfChiTietKichBan.push(newRow);
      }
      // console.log('thong tin chi tiet kich ban: ', this.listOfChiTietKichBan);
    });
  }
  //-------------------------- set Dây chuyền tương ứng theo mã thiết bị -------------------
  setDayChuyen(): void {
    for (let i = 0; i < this.listNhomThietBi.length; i++) {
      if (this.maThietBi === this.listNhomThietBi[i].maThietBi) {
        this.dayChuyen = this.listNhomThietBi[i].dayChuyen;
        console.log('day chuyen: ', this.dayChuyen);
      }
    }
    //  console.log("day chuyen: ", this.dayChuyen)
  }
  trackId(_index: number, item: IChiTietKichBan): number {
    return item.id!;
  }

  previousState(): void {
    window.history.back();
  }

  trackThietBiById(_index: number, item: IThietBi): number {
    return item.id!;
  }
  // ---------------------------- save ---------------------
  save(): void {
    this.isSaving = true;
    const sanXuatHangNgay = this.createFromForm();
    if (sanXuatHangNgay.id !== undefined) {
      this.showSuccessPopupService = false;
      this.subscribeToSaveResponse(this.sanXuatHangNgayService.update(sanXuatHangNgay));
    } else {
      this.showSuccessPopupService = false;
      this.subscribeToCreateResponse(this.sanXuatHangNgayService.create(sanXuatHangNgay));
    }
  }

  saveChiTietSanXuat(): void {
    if (this.editForm.get(['id'])!.value === undefined) {
      // gán id kịch bản, mã kịch bản vào list chi tiết kịch bản request
      for (let i = 0; i < this.listOfChiTietKichBan.length; i++) {
        this.listOfChiTietKichBan[i].idSanXuatHangNgay = this.idSanXuatHangNgay;
      }
      // console.log("gan: ", this.listOfChiTietKichBan);
      //------------ cập nhật kich_ban_id trong table chi tiết sản xuất -------------
      if (this.listOfChiTietKichBan[0].idSanXuatHangNgay === undefined) {
        // alert('Kịch bản chưa được khởi tạo');
      } else {
       
          // alert('Thêm mới chi tiết sản xuất thành công !');
          this.previousState();
        ;
      }
      // console.log(this.listOfChiTietKichBan);
    } else {
      //------------ cập nhật kich_ban_id trong table chi tiết sản xuất -------------
      
        // alert('Cập nhật chi tiết sản xuất thành công !');
        this.previousState();
        // console.log(this.listOfChiTietKichBan);
     
    }
  }

  subscribeToCreateResponse(result: Observable<HttpResponse<ISanXuatHangNgay>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(res => {
      // alert('Thêm mới thành công');
      // console.log("before:",this.listOfChiTietKichBan);
      // gán id kịch bản
      this.idSanXuatHangNgay = res.body?.id;
    });
  }
  subscribeToSaveResponse(result: Observable<HttpResponse<ISanXuatHangNgay>>): void {
    // alert('Cập nhật thành công');
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  onSaveSuccess(): void {
    // this.previousState();
  }

  onSaveError(): void {
    // Api for inheritance.
  }

  onSaveFinalize(): void {
    this.isSaving = false;
  }

  openSuccessPopupService(): void {
    if (this.editForm.get(['id'])!.value !== undefined) {
      this.result = 'Cập nhật kịch bản thành công';
      // this.showSuccessPopupService = true;
    } else {
      this.result = 'Thêm mới kịch bản thành công';
      // this.showSuccessPopupService = true;
    }
    this.showSuccessPopupService = true;
  }

  closeSuccessPopupService(): void {
    this.showSuccessPopupService = false;
  }

  openSuccessPopup(): void {
    if (this.editForm.get(['id'])!.value === undefined) {
      // gán id kịch bản, mã kịch bản vào list chi tiết kịch bản request
      for (let i = 0; i < this.listOfChiTietKichBan.length; i++) {
        this.listOfChiTietKichBan[i].idSanXuatHangNgay = this.idSanXuatHangNgay;
      }
      // console.log("gan: ", this.listOfChiTietKichBan);
      //------------ cập nhật kich_ban_id trong table chi tiết sản xuất -------------
      if (this.listOfChiTietKichBan[0].idSanXuatHangNgay === undefined) {
        // alert('Kịch bản chưa được khởi tạo');
        this.resultThongSo = 'Kịch bản chưa được khởi tạo';
      } else {
        this.http.post<any>(this.chiTietSanXuatUrl, this.listOfChiTietKichBan).subscribe(() => {
          // alert('Thêm mới chi tiết sản xuất thành công !');
          this.resultThongSo = 'Thêm mới chi tiết sản xuất thành công';
          // this.previousState();
        });
      }
      // console.log(this.listOfChiTietKichBan);
    } else {
      //------------ cập nhật kich_ban_id trong table chi tiết sản xuất -------------
      this.http.put<any>(this.putChiTietSanXuatUrl, this.listOfChiTietKichBan).subscribe(() => {
        // alert('Cập nhật chi tiết sản xuất thành công !');
        this.resultThongSo = 'Cập nhật chi tiết sản xuất thành công';
        // this.previousState();
        // console.log(this.listOfChiTietKichBan);
      });
    }
    this.showSuccessPopup = true;
  }

  closeSuccessPopup(): void {
    this.showSuccessPopup = false;
  }

  updateForm(sanXuatHangNgay: ISanXuatHangNgay): void {
    this.editForm.patchValue({
      id: sanXuatHangNgay.id,
      maKichBan: sanXuatHangNgay.maKichBan,
      maThietBi: sanXuatHangNgay.maThietBi,
      loaiThietBi: sanXuatHangNgay.loaiThietBi,
      dayChuyen: sanXuatHangNgay.dayChuyen,
      maSanPham: sanXuatHangNgay.maSanPham,
      versionSanPham: sanXuatHangNgay.versionSanPham,
      ngayTao: sanXuatHangNgay.ngayTao ? sanXuatHangNgay.ngayTao.format(DATE_TIME_FORMAT) : null,
      timeUpdate: sanXuatHangNgay.timeUpdate ? sanXuatHangNgay.timeUpdate.format(DATE_TIME_FORMAT) : null,
      trangThai: sanXuatHangNgay.trangThai,
    });
  }

  createFromForm(): ISanXuatHangNgay {
    return {
      ...new SanXuatHangNgay(),
      id: this.editForm.get(['id'])!.value,
      maKichBan: this.editForm.get(['maKichBan'])!.value,
      maThietBi: this.maThietBi,
      loaiThietBi: this.editForm.get(['loaiThietBi'])!.value,
      dayChuyen: this.dayChuyen,
      maSanPham: this.maSanPham,
      versionSanPham: this.versionSanPham,
      ngayTao: this.editForm.get(['ngayTao'])!.value ? dayjs(this.editForm.get(['ngayTao'])!.value, DATE_TIME_FORMAT) : undefined,
      timeUpdate: this.editForm.get(['timeUpdate'])!.value ? dayjs(this.editForm.get(['timeUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      trangThai: this.editForm.get(['trangThai'])!.value,
    };
  }
  //----------------------------------------- them moi chi tiet san xuat --------------------------

  addRowThongSoKichBan(): void {
    const newRow = {
      id: 0,
      idSanXuatHangNgay: this.idSanXuatHangNgay,
      maKichBan: this.editForm.get(['maKichBan'])!.value,
      thongSo: '',
      minValue: 0,
      maxValue: 0,
      trungbinh: 0,
      donVi: '',
    };
    this.listOfChiTietKichBan.push(newRow);
    console.log('add row', this.listOfChiTietKichBan);
  }

  // sua lai xoa theo stt va ma thong so (id )
  deleteRow(thongSo: string | null | undefined, id: number | null | undefined): void {
    const sanXuatHangNgay = this.createFromForm();
    if (sanXuatHangNgay.id !== undefined) {
      if (confirm('Bạn chắc chắn muốn xóa thông số này?') === true) {
        this.http.delete(`${this.delUrl}/${id as number}`).subscribe(() => {
          alert('Xóa thông số thành công!');
        });
        this.listOfChiTietKichBan = this.listOfChiTietKichBan.filter(d => d.thongSo !== thongSo);
      }
    } else {
      this.listOfChiTietKichBan = this.listOfChiTietKichBan.filter(d => d.thongSo !== thongSo);
    }
  }
}
