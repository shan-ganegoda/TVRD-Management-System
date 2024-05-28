package com.content.security.repository;

import com.content.security.entity.Productorder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOrderRepository extends JpaRepository<Productorder,Integer> {

}
