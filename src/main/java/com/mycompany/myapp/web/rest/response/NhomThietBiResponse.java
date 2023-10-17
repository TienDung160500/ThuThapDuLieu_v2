package com.mycompany.myapp.web.rest.response;

public class NhomThietBiResponse {
    private String loaiThietBi;
    private String maThietBi;
    private String dayChuyen;

    public String getDayChuyen() {
        return dayChuyen;
    }

    public void setDayChuyen(String dayChuyen) {
        this.dayChuyen = dayChuyen;
    }

    public NhomThietBiResponse() {
    }

    public String getLoaiThietBi() {
        return loaiThietBi;
    }

    public void setLoaiThietBi(String loaiThietBi) {
        this.loaiThietBi = loaiThietBi;
    }

    public String getMaThietBi() {
        return maThietBi;
    }

    public void setMaThietBi(String nhomThietBi) {
        this.maThietBi = nhomThietBi;
    }
}
