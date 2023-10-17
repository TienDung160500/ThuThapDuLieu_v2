package com.mycompany.myapp.web.rest.response;

public class DayChuyenResponse {
    private Long id;
    private String dayChuyen;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDayChuyen() {
        return dayChuyen;
    }

    public void setDayChuyen(String dayChuyen) {
        this.dayChuyen = dayChuyen;
    }

    public DayChuyenResponse() {
    }

    public DayChuyenResponse(Long id, String dayChuyen) {
        this.id = id;
        this.dayChuyen = dayChuyen;
    }
}
