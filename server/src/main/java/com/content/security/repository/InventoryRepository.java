package com.content.security.repository;

import com.content.security.entity.Inventory;
import com.content.security.entity.Moh;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {

    boolean existsByMoh(Moh grn);
}
