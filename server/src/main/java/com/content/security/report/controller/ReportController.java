package com.content.security.report.controller;

import com.content.security.report.dto.CountByProductOrderDTO;
import com.content.security.report.dto.ProductOrdersByProductDTO;
import com.content.security.report.dto.CountByVaccineOrderDTO;
import com.content.security.report.entity.*;
import com.content.security.report.repository.*;
import com.content.security.report.service.ChildReportService;
import com.content.security.report.service.MotherReportService;
import com.content.security.report.service.ProductOrderReportService;
import com.content.security.report.service.VaccineOrderReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/reports")
public class ReportController {

    private final CountByProductOrderRepository countByProductOrderRepository;
    private final CountByDesignationRepository countByDesignationRepository;
    private final VehicleCountByMohRepository vehicleCountByMohRepository;
    private final VehicleCountByRdhRepository vehicleCountByRdhRepository;

    private final ProductOrderReportService productOrderReportService;
    private final VaccineOrderReportService vaccineOrderReportService;
    private final MotherReportService motherReportService;
    private final ChildReportService childReportService;
    private final CountByPdhRepository countByPdhRepository;

    @GetMapping(path = "/countbypdh")
    public List<CountByPdh> getCountByPdh() {

        List<CountByPdh> countByPdhs = countByPdhRepository.findCountByRdh();
        return countByPdhs;
    }

    @GetMapping(path = "/packetsbelowh")
    public List<MohCount> getCountByPacketsBelowH() {
        return countByPdhRepository.findMohWithPacketsBelowH();
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

    @GetMapping(path = "/vehiclecountbyrdh")
    public List<VehicleCountByRdh> getVehicleCountByRdh() {

        List<VehicleCountByRdh> vehicleCountByRdhs = vehicleCountByRdhRepository.findVehicleCountByRdh();
        return vehicleCountByRdhs;
    }

    @GetMapping(path = "/countbyvaccineorderdate")
    public List<CountByVaccineOrderDTO> getCountByVaccineOrderDate(@RequestParam HashMap<String,String> params) throws Exception {
        return vaccineOrderReportService.getCountByVaccineOrderDate(params);
    }

    @GetMapping(path = "/countbymotherregister")
    public List<CountByMotherRegistration> getCountByMotherRegister(@RequestParam HashMap<String,String> params) {
        return motherReportService.getCountByMotherRegister(params);
    }

    @GetMapping(path = "/countbychildregister")
    public List<CountByChildRegistration> getCountByChildRegister(@RequestParam HashMap<String,String> params) {
        return childReportService.getCountByChildRegister(params);
    }

}
