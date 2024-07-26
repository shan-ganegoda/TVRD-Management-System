package com.content.security.repository;

import com.content.security.entity.Childrecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildRecordRepository extends JpaRepository<Childrecord,Integer> {

    boolean existsByRegno(String regno);
}
