package com.content.security.repository;


import com.content.security.entity.Moh;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MohRepository extends JpaRepository<Moh,Integer> {

    boolean existsByEmailOrTeleOrFaxno(String email, String tele, String faxno);

    boolean existsByEmail(String email);
    boolean existsByTele(String tele);
    boolean existsByFaxno(String faxno);
    boolean existsByCodename(String codename);
}
