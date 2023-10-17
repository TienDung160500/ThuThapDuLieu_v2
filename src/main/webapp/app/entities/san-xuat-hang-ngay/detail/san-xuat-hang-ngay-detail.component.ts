import { writeXLSX } from 'xlsx';
import { IChiTietSanXuat } from 'app/entities/chi-tiet-san-xuat/chi-tiet-san-xuat.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

import { ISanXuatHangNgay } from '../san-xuat-hang-ngay.model';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-san-xuat-hang-ngay-detail',
  templateUrl: './san-xuat-hang-ngay-detail.component.html',
  styleUrls: ['./san-xuat-hang-ngay-detail.component.css']
})
export class SanXuatHangNgayDetailComponent implements OnInit {
  //---------------------- url lay thong tin chi tiet kich ban --------------------
  resourceUrl = this.applicationConfigService.getEndpointFor('api/san-xuat-hang-ngay/chi-tiet-san-xuat');
  predicate!: string;
  ascending!: boolean;
  sanXuatHangNgay: ISanXuatHangNgay | null = null;
  chiTietSanXuats: IChiTietSanXuat[] | null = []

  fileName = 'San xuat hang ngay.xlsx'

  constructor(protected activatedRoute: ActivatedRoute, protected http: HttpClient,protected applicationConfigService:ApplicationConfigService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ sanXuatHangNgay }) => {
      this.sanXuatHangNgay = sanXuatHangNgay;
      // console.log('sxhn: ',this.sanXuatHangNgay)
    });
    // lay thong tin thong so thiet bi
    if(this.sanXuatHangNgay?.id){
      this.http.get<any>(`${this.resourceUrl}/${this.sanXuatHangNgay.id}`).subscribe(res =>{
        this.chiTietSanXuats = res ;
        // console.log("res :", res);
        // console.log("chi tiet san xuat :", this.chiTietSanXuats);
      });
    }
  }

  previousState(): void {
    window.history.back();
  }

  exportExcel(): void {
    const element = document.getElementById('export_excel');

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    
    XLSX.writeFile(wb,this.fileName)
  }
}
