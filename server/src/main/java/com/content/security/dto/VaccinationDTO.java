package com.content.security.dto;

import com.content.security.entity.Childrecord;
import com.content.security.entity.Clinic;
import com.content.security.entity.Vaccinationprogress;
import com.content.security.entity.Vaccinationrecord;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VaccinationDTO {

    private Integer id;
    private Clinic clinic;
    private Childrecord childrecords;
    private Vaccinationprogress vaccinationprogress;
    private LocalDate lastupdated;
    private String description;
    private Set<Vaccinationrecord> vaccinationrecords;
}
