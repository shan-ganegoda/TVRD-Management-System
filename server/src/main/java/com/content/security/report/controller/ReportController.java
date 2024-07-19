package com.content.security.report.controller;

import com.content.security.report.dto.CountByProductOrderDTO;
import com.content.security.report.entity.CountByDesignation;
import com.content.security.report.entity.CountByPdh;
import com.content.security.report.entity.CountByProductOrder;
import com.content.security.report.entity.VehicleCountByMoh;
import com.content.security.report.repository.CountByDesignationRepository;
import com.content.security.report.repository.CountByPdhRepository;
import com.content.security.report.repository.CountByProductOrderRepository;
import com.content.security.report.repository.VehicleCountByMohRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/reports")
public class ReportController {

    private final CountByPdhRepository countByRdhRepository;
    private final CountByProductOrderRepository countByRdhProductOrderRepository;
    private final CountByDesignationRepository countByDesignationRepository;
    private final VehicleCountByMohRepository vehicleCountByMohRepository;

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
    public List<CountByProductOrderDTO> getCountByProductOrderDate(@RequestParam HashMap<String,String> params) throws Exception {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        LocalDate startDate;
        LocalDate endDate;

        String startDateStr = params.getOrDefault("startdate","2015-01-01");
        String endDateStr = params.getOrDefault("enddate","2024-12-31");

        startDate = LocalDate.parse(startDateStr);
        endDate = LocalDate.parse(endDateStr);

        List<CountByProductOrder> countByProductOrders = countByRdhProductOrderRepository.findCountByProductOrderBetween(startDate,endDate);

        List<CountByProductOrderDTO> dtoList = new ArrayList<>();

        /**
         * This split date into YYYY-MM format and put all these result into dto list
         */
        for (CountByProductOrder countByProductOrder : countByProductOrders) {
            CountByProductOrderDTO dto = new CountByProductOrderDTO(YearMonth.from(countByProductOrder.getRequestedDate()),countByProductOrder.getCount());
            dtoList.add(dto);
        }
        /**
         * This combine the duplicate month entries and return a Map with result
         */
         Map<YearMonth,Long> combinedMap = dtoList.stream().collect(Collectors.groupingBy(
                 CountByProductOrderDTO::getRequestedDate,
                 Collectors.summingLong(list -> Math.toIntExact(list.getCount()))
         ));

        /**
         * This is the place where the map convert into a list of CountByProductOrderDTO
         */
        List<CountByProductOrderDTO> list = combinedMap.entrySet().stream()
                .map(entry -> new CountByProductOrderDTO(entry.getKey(),entry.getValue()))
                .toList();


        return list;
    }

    @GetMapping(path = "/countbydesignation")
    public List<CountByDesignation> getCountByDesignation() {

        List<CountByDesignation> countByDesignations = countByDesignationRepository.countByDesignation();
        return countByDesignations;
    }

    @GetMapping(path = "/vehiclecountbymoh")
    public List<VehicleCountByMoh> getVehicleCountByMoh() {

        List<VehicleCountByMoh> vehicleCountByMohs = vehicleCountByMohRepository.findVehicleCountByMoh();
        return vehicleCountByMohs;
    }

}
