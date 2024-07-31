package com.content.security.report.service;

import com.content.security.report.dto.CountByVaccineOrderDTO;
import com.content.security.report.entity.CountByVaccineOrder;
import com.content.security.report.repository.CountByVaccineOrderRepository;
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
public class VaccineOrderReportServiceIMPL implements VaccineOrderReportService{

    private final CountByVaccineOrderRepository countByVaccineOrderRepository;

    @Override
    public List<CountByVaccineOrderDTO> getCountByVaccineOrderDate(HashMap<String, String> params) {

        LocalDate startDate;
        LocalDate endDate;

        String startDateStr = params.getOrDefault("startDate","2015-01-01");
        String endDateStr = params.getOrDefault("endDate","2024-12-31");

        startDate = LocalDate.parse(startDateStr);
        endDate = LocalDate.parse(endDateStr);


        List<CountByVaccineOrder> countbyvaccineorders = countByVaccineOrderRepository.findCountByVaccineOrderBetween(startDate,endDate);

        List<CountByVaccineOrderDTO> dtoList = new ArrayList<>();

        /**
         * This split date into YYYY-MM format and put all these result into dto list
         */
        for (CountByVaccineOrder countByVaccineOrder : countbyvaccineorders) {
            CountByVaccineOrderDTO dto = new CountByVaccineOrderDTO(YearMonth.from(countByVaccineOrder.getRequestedDate()),countByVaccineOrder.getCount());
            dtoList.add(dto);
        }
        /**
         * This combine the duplicate month entries and return a Map with result
         */
        Map<YearMonth,Long> combinedMap = dtoList.stream().collect(Collectors.groupingBy(
                CountByVaccineOrderDTO::getRequestedDate,
                Collectors.summingLong(list -> Math.toIntExact(list.getCount()))
        ));

        /**
         * This is the place where the map convert into a list of CountByProductOrderDTO
         */
        List<CountByVaccineOrderDTO> list = combinedMap.entrySet().stream()
                .map(entry -> new CountByVaccineOrderDTO(entry.getKey(),entry.getValue()))
                .toList();


        return list;
    }
}
