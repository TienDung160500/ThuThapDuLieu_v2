package com.mycompany.myapp.web.rest.response;


import java.time.ZonedDateTime;
import java.util.Date;


public class QuanLyThongSoResponse {
    private Long id;
    private String maThongSo;
    private String tenThongSo;
    private String moTa;
    private ZonedDateTime ngayTao;
    private ZonedDateTime ngayUpdate;
    private String updateBy;
    private String status;

    public QuanLyThongSoResponse(){}

    public QuanLyThongSoResponse(Long id, String maThongSo, String tenThongSo, String moTa, ZonedDateTime ngayTao, ZonedDateTime ngayUpdate, String updateBy, String status) {
        this.id = id;
        this.maThongSo = maThongSo;
        this.tenThongSo = tenThongSo;
        this.moTa = moTa;
        this.ngayTao = ngayTao;
        this.ngayUpdate = ngayUpdate;
        this.updateBy = updateBy;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
