package com.content.security.repository;

import com.content.security.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;


public interface RevokedTokenRepository extends JpaRepository<RevokedToken,Integer> {


    boolean existsByToken(String token);

    List<RevokedToken> findAllByExpirationdateBefore(Instant now);
}
