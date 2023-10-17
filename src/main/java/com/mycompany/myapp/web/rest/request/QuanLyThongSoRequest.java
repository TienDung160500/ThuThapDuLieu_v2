package com.mycompany.myapp.web.rest.request;


import java.time.ZonedDateTime;
import java.util.Date;

public class QuanLyThongSoRequest {
    private String maThongSo;
    private String tenThongSo;
    private String moTa;
    private String status;
    private ZonedDateTime ngayTao;
    private ZonedDateTime ngayUpdate;
    private String updateBy;

    public QuanLyThongSoRequest() {
    }

    public String getMaThongSo() {
        return maThongSo;
    }

    public void setMaThongSo(String maThongSo) {
        this.maThongSo = maThongSo;
    }

    public String getTenThongSo() {
        return tenThongSo;
    }

    public void setTenThongSo(String tenThongSo) {
        this.tenThongSo = tenThongSo;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getNgayTao() {
        return ngayTao;
    }

    public void setNgayTao(ZonedDateTime ngayTao) {
        this.ngayTao = ngayTao;
    }

    public ZonedDateTime getNgayUpdate() {
        return ngayUpdate;
    }

    public void setNgayUpdate(ZonedDateTime ngayUpdate) {
        this.ngayUpdate = ngayUpdate;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }
}
