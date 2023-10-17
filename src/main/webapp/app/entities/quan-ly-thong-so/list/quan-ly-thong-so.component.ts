import { Account } from './../../../core/auth/account.model';
import { FormBuilder } from '@angular/forms';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuanLyThongSo } from '../quan-ly-thong-so.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { QuanLyThongSoService } from '../service/quan-ly-thong-so.service';
import { QuanLyThongSoDeleteDialogComponent } from '../delete/quan-ly-thong-so-delete-dialog.component';

@Component({
  selector: 'jhi-quan-ly-thong-so',
  templateUrl: './quan-ly-thong-so.component.html',
  styleUrls: ['./quan-ly-thong-so.component.css'],
})
export class QuanLyThongSoComponent implements OnInit {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/quan-ly-thong-so/tim-kiem');

  resourceUrlSearch = this.applicationConfigService.getEndpointFor('api/quan-ly-thong-so');

  account: Account | null = null;

  maxResultToShow = 10;
  showingResults = 10;
  currentPage = 1;
  startIndex = 0;

  @Input() maThongSo = '';
  @Input() tenThongSo = '';
  @Input() moTa = '';
  @Input() ngayTao = null;
  @Input() ngayUpdate = null;
  @Input() updateBy = '';
  @Input() status = '';

  listQuanLyThongSo: IQuanLyThongSo[] = [];

  selectedStatus: string | null = null;

  searchTerm = '';
  searchResult: any[] = [];
  // searchForm: FormGroup;

  searchTerms = new Subject<string>();

  quanLyThongSos?: IQuanLyThongSo[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  searchKeyword = '';
  seachResult: any[] = [];
  searchSuggestions: string[] = [];
  showSuggestions = false;
  @ViewChild('searchInput', { static: true })
  searchInput!: ElementRef;

  searchResults: IQuanLyThongSo[] = [];

  refreshTemplete = false;
  displayedResults: IQuanLyThongSo[] | undefined;

  constructor(
    protected quanLyThongSoService: QuanLyThongSoService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private formBuilder: FormBuilder
  ) {}
  //------------------------------------------- lay danh sach quan ly thong so
  getQuanLyThongSoList(): void {
    this.http.get<any>(this.resourceUrlSearch).subscribe(res => {
      this.listQuanLyThongSo = res;
      // console.log('log', this.listQuanLyThongSo);
    });
  }

  onChangeSearch(): void {
    // console.log('Selected Status:', this.selectedStatus);
  }

  onChangeQuanlyThongSo(): void {
    const results = this.listQuanLyThongSo.find((obj: IQuanLyThongSo) => obj.maThongSo === this.maThongSo);
    console.log(results);
  }

  onSearch(): void {
    this.searchResults = this.listQuanLyThongSo.filter((obj: any) => obj.name.toLowerCase().includes(this.searchTerm.toLowerCase));
  }

  timKiemThietBi(page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page ?? this.page ?? 1;

    //xoa du lieu cu
    this.searchResults = [];
    //request den server
    const timKiem = {
      maThongSo: this.maThongSo,
      tenThongSo: this.tenThongSo,
      moTa: this.moTa,
      ngayTao: this.ngayTao,
      ngayUpdate: this.ngayUpdate,
      updateBy: this.updateBy,
      status: this.status,
    };
    this.http.post<any>(this.resourceUrl, timKiem).subscribe(res => {
      // luu du lieu tra ve de hien thi len front-end
      this.quanLyThongSos = res;
      // tinh chi so bat dau cua cua ket qua can hien thi tren trang hien tai bang cach lay trang hien tai(this.currentPage) nhan voi so ket qua toi da can hien thi tren moi trang
      this.startIndex = (this.currentPage - 1) * this.maxResultToShow;
      // su dung slice de cat mang, chi lay nhung ket qua can hien thi tren trang hien tai, gioi han ket qua cua trang hien tai de hien thi so luong toi da
      this.quanLyThongSos = this.quanLyThongSos?.slice(this.startIndex, this.startIndex + this.maxResultToShow);
      this.updateResultSuggestions(res.quanLyThongSos);

      console.log('tim kiem: ', res);
      console.log('body', timKiem);
      // goi ham de cap nhat trang, hien thi ket qua va thuc hien dieu huong sau khi tim kiem hoan tat
      this.onSuccess(res.quanLyThongSos, res.headers, pageToLoad, !dontNavigate);
    });
  }

  updateResultSuggestions(timKiem: any[]): void {
    // tao danh sach ket qua goi y
    const tenThongSoSuggestions = [];

    // Lặp qua kết quả của mã thông số để tạo danh sách gợi ý cho tên thông số
    for (const result of timKiem) {
      tenThongSoSuggestions.push(result.tenThongSo);
    }

    // Gán danh sách kết quả gợi ý cho tên thông số vào datalist
    const tenThongSoDatalist = document.getElementById('tenThongSo');
    tenThongSoDatalist!.innerHTML = '';
    for (const suggestion of tenThongSoSuggestions) {
      const option = document.createElement('option');
      option.value = suggestion;
      tenThongSoDatalist?.appendChild(option);
    }
  }

  loadPage(page?: number, dontNavigate?: boolean): void {
    // thong bao load du lieu
    this.isLoading = true;
    // xac dinh trang se duoc tai. kiem tra tham so page duoc truyen vao co phai null or undefined, thi no se sd gia tri cua page, neu kh thi se ktra this.page, neu ca 2 kh co thi mac dinh la 1
    const pageToLoad: number = page ?? this.page ?? 1;
    // cap nhat gia tri cua bien current page thanh trang hien tai
    this.currentPage = pageToLoad;
    // truy van du lieu thong qua phuong thuc query. gom truyen thong tin ve trang, kich thuoc trang, cach sx du lieu
    this.quanLyThongSoService
      .query({
        page: pageToLoad - 1,
        size: this.maxResultToShow,
        sort: this.sort(),
      })
      // su dung observable de lang nghe ket qua tu yeu cau truy van. neu yeu cau thanh cong, ham callback next se duoc goi
      .subscribe({
        next: (res: HttpResponse<IQuanLyThongSo[]>) => {
          // dat bien isloading thanh false de tai du lieu
          this.isLoading = false;
          // goi ham onSuccess de cap nhat du lieu tren trang hien tai dua tren ket qua tra ve tu yeu cau truy van
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
          // goi ham timkiemthietbi de thuc hien tim kiem voi trang hien tai va chuyen den trang tuong ung
          this.timKiemThietBi(pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.handleNavigation();
    this.getQuanLyThongSoList();
  }

  onSearchTermChange(): void {
    this.searchTerms.next(this.searchTerm);
  }

  selectResult(result: any): void {
    console.log('select result', result);
    this.searchTerm = '';
    this.searchResult = [];
  }

  trackId(_index: number, item: IQuanLyThongSo): number {
    return item.id!;
  }

  delete(quanLyThongSo: IQuanLyThongSo): void {
    const modalRef = this.modalService.open(QuanLyThongSoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.quanLyThongSo = quanLyThongSo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        // alert('Xóa thông số thành công !');
        this.loadPage();
      }
    });
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  onSuccess(data: IQuanLyThongSo[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/quan-ly-thong-so'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.quanLyThongSos = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}

