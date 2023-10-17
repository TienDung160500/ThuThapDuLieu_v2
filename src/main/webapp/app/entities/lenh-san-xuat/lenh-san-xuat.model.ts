import { IChiTietLenhSanXuat } from 'app/entities/chi-tiet-lenh-san-xuat/chi-tiet-lenh-san-xuat.model';

export interface ILenhSanXuat {
  id?: number;
  maLenhSanXuat?: number;
  entryTime?: string | null;
  status?: string | null;
  comment?: string | null;
  sender?: string | null;
  approver?: string | null;
  chiTietLenhSanXuats?: IChiTietLenhSanXuat[] | null;
}

export class LenhSanXuat implements ILenhSanXuat {
  constructor(
    public id?: number,
    public maLenhSanXuat?: number,
    public entryTime?: string | null,
    public status?: string | null,
    public comment?: string | null,
    public sender?: string | null,
    public approver?: string | null,
    public chiTietLenhSanXuats?: IChiTietLenhSanXuat[] | null
  ) {}
}

export function getLenhSanXuatIdentifier(lenhSanXuat: ILenhSanXuat): number | undefined {
  return lenhSanXuat.id;
}
