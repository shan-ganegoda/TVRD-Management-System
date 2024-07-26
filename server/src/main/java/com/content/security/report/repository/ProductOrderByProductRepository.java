package com.content.security.report.repository;

import com.content.security.report.entity.ProductOrdersByProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProductOrderByProductRepository extends JpaRepository<ProductOrdersByProduct,Integer> {

    @Query("SELECT NEW ProductOrdersByProduct (po.dorequested,sum(case when pop.product.id =1 then pop.quentity else 0 end),sum(case when pop.product.id =2 then pop.quentity else 0 end)) FROM Productorder po join Productorderproduct pop on po.id = pop.productorder.id where pop.product.id in (1,2) and po.dorequested between :startDate and :endDate group by po.dorequested order by po.dorequested")
    List<ProductOrdersByProduct> findOrderByProducts(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
