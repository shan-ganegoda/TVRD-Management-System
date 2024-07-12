package com.content.security.dto;

import com.content.security.entity.Moh;
import com.content.security.entity.Vehiclemodel;
import com.content.security.entity.Vehiclestatus;
import com.content.security.entity.Vehicletype;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {

    private Integer id;
    private String number;
    private LocalDate doattached;
    private Integer yom;
    private Integer capacity;
    private String description;
    private Integer currentmeterreading;
    private LocalDate lastregdate;
    private Vehiclestatus vehiclestatus;
    private Vehicletype vehicletype;
    private Vehiclemodel vehiclemodel;
    private Moh moh;
}
