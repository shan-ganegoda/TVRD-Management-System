package com.content.security.dto;

import com.content.security.entity.Moh;
import com.content.security.entity.Vehiclemodel;
import com.content.security.entity.Vehiclestatus;
import com.content.security.entity.Vehicletype;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "^[A-Z]{2,3}-\\d{4}$", message = "Invalid Number")
    private String number;
    private LocalDate doattached;
    @Pattern(regexp = "^\\d{4}$", message = "Invalid YOM")
    private Integer yom;
    @Pattern(regexp = "^\\d{3,5}$", message = "Invalid Capacity")
    private Integer capacity;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Pattern(regexp = "^\\d{0,7}$", message = "Invalid Current Meter Reading")
    private Integer currentmeterreading;
    private LocalDate lastregdate;
    private Vehiclestatus vehiclestatus;
    private Vehicletype vehicletype;
    private Vehiclemodel vehiclemodel;
    private Moh moh;
}
