package com.content.security.dto;

import com.content.security.entity.Vehiclebrand;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VehicleModelDTO {

    private Integer id;
    private String name;
    private Vehiclebrand vehiclebrand;
}
