package com.content.security.repository;

import com.content.security.entity.Productorderstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOrderStatusRepository extends JpaRepository<Productorderstatus,Integer> {
}
