package com.content.security.dto;

import com.content.security.entity.Employee;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GenderDTO {

        private Integer id;
        private String name;
}

