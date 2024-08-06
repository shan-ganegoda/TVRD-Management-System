package com.content.security.dto;

import com.content.security.entity.Productorderstatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductOrderStatusUpdateDTO {

    private Integer id;
    private Productorderstatus productorderstatus;
}
