package com.content.security.dto;

import com.content.security.entity.Designation;
import com.content.security.entity.EmpType;
import com.content.security.entity.Employeestatus;
import com.content.security.entity.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateDTO {


    private Integer id;

    private String number;

    private String fullname;

    private String callingname;

    private byte[] photo;

    private Date dobirth;

    private String nic;

    private String address;

    private String mobile;

    private String land;

    private String description;

    private String email;


    private Gender gender;

    private Designation designation;

    private EmpType emptype;

    private Employeestatus employeestatus;

}
