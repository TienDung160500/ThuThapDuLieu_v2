package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A LenhSanXuat.
 */
@Entity
@Table(name = "lenh_san_xuat")
public class LenhSanXuat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "ma_lenh_san_xuat", nullable = false, unique = true)
    private Integer maLenhSanXuat;

    @Column(name = "entry_time")
    private String entryTime;

    @Column(name = "status")
    private String status;

    @Column(name = "comment")
    private String comment;

    @OneToMany(mappedBy = "lenhSanXuat")
    @JsonIgnoreProperties(value = { "lenhSanXuat" }, allowSetters = true)
    private Set<ChiTietLenhSanXuat> chiTietLenhSanXuats = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LenhSanXuat id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMaLenhSanXuat() {
        return this.maLenhSanXuat;
    }

    public LenhSanXuat maLenhSanXuat(Integer maLenhSanXuat) {
        this.setMaLenhSanXuat(maLenhSanXuat);
        return this;
    }

    public void setMaLenhSanXuat(Integer maLenhSanXuat) {
        this.maLenhSanXuat = maLenhSanXuat;
    }

    public String getEntryTime() {
        return this.entryTime;
    }

    public LenhSanXuat entryTime(String entryTime) {
        this.setEntryTime(entryTime);
        return this;
    }

    public void setEntryTime(String entryTime) {
        this.entryTime = entryTime;
    }

    public String getStatus() {
        return this.status;
    }

    public LenhSanXuat status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getComment() {
        return this.comment;
    }

    public LenhSanXuat comment(String comment) {
        this.setComment(comment);
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Set<ChiTietLenhSanXuat> getChiTietLenhSanXuats() {
        return this.chiTietLenhSanXuats;
    }

    public void setChiTietLenhSanXuats(Set<ChiTietLenhSanXuat> chiTietLenhSanXuats) {
        if (this.chiTietLenhSanXuats != null) {
            this.chiTietLenhSanXuats.forEach(i -> i.setLenhSanXuat(null));
        }
        if (chiTietLenhSanXuats != null) {
            chiTietLenhSanXuats.forEach(i -> i.setLenhSanXuat(this));
        }
        this.chiTietLenhSanXuats = chiTietLenhSanXuats;
    }

    public LenhSanXuat chiTietLenhSanXuats(Set<ChiTietLenhSanXuat> chiTietLenhSanXuats) {
        this.setChiTietLenhSanXuats(chiTietLenhSanXuats);
        return this;
    }

    public LenhSanXuat addChiTietLenhSanXuat(ChiTietLenhSanXuat chiTietLenhSanXuat) {
        this.chiTietLenhSanXuats.add(chiTietLenhSanXuat);
        chiTietLenhSanXuat.setLenhSanXuat(this);
        return this;
    }

    public LenhSanXuat removeChiTietLenhSanXuat(ChiTietLenhSanXuat chiTietLenhSanXuat) {
        this.chiTietLenhSanXuats.remove(chiTietLenhSanXuat);
        chiTietLenhSanXuat.setLenhSanXuat(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LenhSanXuat)) {
            return false;
        }
        return id != null && id.equals(((LenhSanXuat) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LenhSanXuat{" +
            "id=" + getId() +
            ", maLenhSanXuat=" + getMaLenhSanXuat() +
            ", entryTime='" + getEntryTime() + "'" +
            ", status='" + getStatus() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
