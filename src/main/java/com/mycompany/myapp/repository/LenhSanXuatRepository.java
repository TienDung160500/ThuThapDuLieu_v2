package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.LenhSanXuat;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LenhSanXuat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LenhSanXuatRepository extends JpaRepository<LenhSanXuat, Long> {}
