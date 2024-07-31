package com.content.security.report.controller;

import com.content.security.report.dto.CountByProductOrderDTO;
import com.content.security.report.dto.ProductOrdersByProductDTO;
import com.content.security.report.dto.CountByVaccineOrderDTO;
import com.content.security.report.entity.*;
import com.content.security.report.repository.*;
import com.content.security.report.service.MotherReportService;
import com.content.security.report.service.ProductOrderReportService;
import com.content.security.report.service.VaccineOrderReportService;
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
    private final CountByProductOrderRepository countByProductOrderRepository;
    private final CountByDesignationRepository countByDesignationRepository;
    private final VehicleCountByMohRepository vehicleCountByMohRepository;

    private final ProductOrderReportService productOrderReportService;
    private final VaccineOrderReportService vaccineOrderReportService;
    private final MotherReportService motherReportService;

    @GetMapping(path = "/countbypdh")
    public List<CountByPdh> getCountByPdh() {

        List<CountByPdh> countByPdhs = countByRdhRepository.findCountByRdh();
        return countByPdhs;
    }

    @GetMapping(path = "/countbyproductorder")
    public List<CountByProductOrder> getCountByProductOrder() {
        List<CountByProductOrder> countByProductOrders = countByProductOrderRepository.findCountByProductOrder();
        return countByProductOrders;
    }

    @GetMapping(path = "/countbyproductorderdate")
    public List<CountByProductOrderDTO> getCountByProductOrderDate(@RequestParam HashMap<String,String> params) throws Exception {
        return productOrderReportService.getCountByProductOrderDate(params);
    }

    @GetMapping(path = "/countbyproductorderdateandproduct")
    public List<ProductOrdersByProductDTO> getCountByProductOrderDateAndProduct(@RequestParam HashMap<String,String> params) throws Exception {
        return productOrderReportService.getCountByProductOrderDateAndProduct(params);
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

    @GetMapping(path = "/countbyvaccineorderdate")
    public List<CountByVaccineOrderDTO> getCountByVaccineOrderDate(@RequestParam HashMap<String,String> params) throws Exception {
        return vaccineOrderReportService.getCountByVaccineOrderDate(params);
    }

    @GetMapping(path = "/countbymotherregister")
    public List<CountByMotherRegistration> getCountByMotherRegister(@RequestParam HashMap<String,String> params) {
        return motherReportService.getCountByMotherRegister(params);
    }

}
