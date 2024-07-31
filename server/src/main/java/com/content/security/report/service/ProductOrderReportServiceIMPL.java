package com.content.security.report.service;

import com.content.security.report.dto.CountByProductOrderDTO;
import com.content.security.report.dto.ProductOrdersByProductDTO;
import com.content.security.report.entity.CountByProductOrder;
import com.content.security.report.entity.ProductCount;
import com.content.security.report.entity.ProductOrdersByProduct;
import com.content.security.report.repository.CountByProductOrderRepository;
import com.content.security.report.repository.ProductOrderByProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductOrderReportServiceIMPL implements ProductOrderReportService{

    private final CountByProductOrderRepository countByProductOrderRepository;
    private final ProductOrderByProductRepository productOrderByProductRepository;


    @Override
    public List<CountByProductOrderDTO> getCountByProductOrderDate(HashMap<String, String> params) {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        LocalDate startDate;
        LocalDate endDate;

        String startDateStr = params.getOrDefault("startDate","2015-01-01");
        String endDateStr = params.getOrDefault("endDate","2024-12-31");

        startDate = LocalDate.parse(startDateStr);
        endDate = LocalDate.parse(endDateStr);


        List<CountByProductOrder> countByProductOrders = countByProductOrderRepository.findCountByProductOrderBetween(startDate,endDate);

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

    @Override
    public List<ProductOrdersByProductDTO> getCountByProductOrderDateAndProduct(HashMap<String, String> params) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

        LocalDate startDate;
        LocalDate endDate;

        String startDateStr = params.getOrDefault("startDate","2015-01-01");
        String endDateStr = params.getOrDefault("endDate","2024-12-31");

        startDate = LocalDate.parse(startDateStr);
        endDate = LocalDate.parse(endDateStr);


        List<ProductOrdersByProduct> productOrdersByProducts = productOrderByProductRepository.findOrderByProducts(startDate,endDate);

        List<ProductOrdersByProductDTO> dtoList = new ArrayList<>();

        /**
         * This split date into YYYY-MM format and put all these result into dto list
         */
        for (ProductOrdersByProduct productOrdersByProduct : productOrdersByProducts) {
            ProductOrdersByProductDTO dto = new ProductOrdersByProductDTO(YearMonth.from(productOrdersByProduct.getRequestedDate()),productOrdersByProduct.getProduct1count(),productOrdersByProduct.getProduct2count());
            dtoList.add(dto);
        }
        /**
         * This combine the duplicate month entries and return a Map with result
         */
        Map<YearMonth, ProductCount> combinedMap = dtoList.stream()
                .collect(Collectors.toMap(
                        ProductOrdersByProductDTO::getRequestedDate,
                        dto -> new ProductCount(dto.getProduct1count(), dto.getProduct2count()),
                        (existing, replacement) -> {
                            existing.add(replacement.getProduct1count(), replacement.getProduct2count());
                            return existing;
                        }
                ));

        /**
         * This is the place where the map convert into a list of CountByProductOrderDTO
         */
        List<ProductOrdersByProductDTO> list = combinedMap.entrySet().stream()
                .map(entry -> new ProductOrdersByProductDTO(entry.getKey(),entry.getValue().getProduct1count(),entry.getValue().getProduct2count()))
                .toList();


        return list;
    }
}
