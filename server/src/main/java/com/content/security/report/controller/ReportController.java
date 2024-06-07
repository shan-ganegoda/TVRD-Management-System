package com.content.security.report.controller;

import com.content.security.report.entity.CountByPdh;
import com.content.security.report.entity.CountByProductOrder;
import com.content.security.report.repository.CountByPdhRepository;
import com.content.security.report.repository.CountByProductOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/reports")
public class ReportController {

    private final CountByPdhRepository countByRdhRepository;
    private final CountByProductOrderRepository countByRdhProductOrderRepository;

    @GetMapping(path = "/countbypdh")
    public List<CountByPdh> getCountByPdh() {

        List<CountByPdh> countByPdhs = countByRdhRepository.findCountByRdh();
        return countByPdhs;
    }

    @GetMapping(path = "/countbyproductorder")
    public List<CountByProductOrder> getCountByProductOrder() {
        List<CountByProductOrder> countByProductOrders = countByRdhProductOrderRepository.findCountByProductOrder();
        return countByProductOrders;
    }

    @GetMapping(path = "/countbyproductorderdate")
    public List<CountByProductOrder> getCountByProductOrderDate(@RequestParam HashMap<String,String> params) throws Exception {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        LocalDate startDate;
        LocalDate endDate;

        String startDateStr = params.getOrDefault("startdate","2015-01-01");
        String endDateStr = params.getOrDefault("enddate","2024-12-31");

        startDate = LocalDate.parse(startDateStr);
        endDate = LocalDate.parse(endDateStr);

        List<CountByProductOrder> countByProductOrders = countByRdhProductOrderRepository.findCountByProductOrderBetween(startDate,endDate);
        return countByProductOrders;
    }
}
