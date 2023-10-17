package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ChiTietLenhSanXuat;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the ChiTietLenhSanXuat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChiTietLenhSanXuatRepository extends JpaRepository<ChiTietLenhSanXuat, Long> {}
