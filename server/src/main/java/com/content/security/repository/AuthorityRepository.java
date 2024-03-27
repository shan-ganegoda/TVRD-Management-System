package com.content.security.repository;

import com.content.security.entity.Authority;
import com.content.security.entity.Employeestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority,Integer> {

}
