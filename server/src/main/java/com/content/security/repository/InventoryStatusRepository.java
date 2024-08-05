package com.content.security.repository;

import com.content.security.entity.Inventorystatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryStatusRepository extends JpaRepository<Inventorystatus,Integer> {
}
