package com.content.security.repository;

import com.content.security.entity.Reviewstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewStatusRepository extends JpaRepository<Reviewstatus,Integer> {
}
