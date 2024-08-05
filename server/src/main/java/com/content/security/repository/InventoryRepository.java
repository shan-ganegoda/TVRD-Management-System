package com.content.security.repository;

import com.content.security.entity.Grn;
import com.content.security.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    boolean existsByGrn(Grn grn);
}
