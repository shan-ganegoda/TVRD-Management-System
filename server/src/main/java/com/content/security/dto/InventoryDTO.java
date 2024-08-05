package com.content.security.dto;

import com.content.security.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InventoryDTO {

    private Integer id;
    private Moh moh;
    private Grn grn;
    private Employee employee;
    private Integer bagscount;
    private String description;
    private LocalDate date;
    private Integer totalpacketcount;
    private Inventorystatus inventorystatus;
    private Set<Inventoryproduct> inventoryproducts;
}
