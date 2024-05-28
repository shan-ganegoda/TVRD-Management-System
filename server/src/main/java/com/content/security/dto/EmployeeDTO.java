package com.content.security.dto;

import com.content.security.entity.Designation;
import com.content.security.entity.EmpType;
import com.content.security.entity.Employeestatus;
import com.content.security.entity.Gender;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {

    private Integer id;

    @Pattern(regexp = "^E\\d{3}$", message = "Invalid Number")
    private String number;

    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Fullname")
    private String fullname;

    @Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Calligname")
    private String callingname;

    private byte[] photo;

    private Date dobirth;

    @Pattern(regexp = "^(([\\d]{9}[vVxX])|([\\d]{12}))$", message = "Invalid NIC")
    private String nic;

    private String address;

    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Mobile Number")
    private String mobile;

    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Landphone Number")
    private String land;

    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;

    private String email;

    private Gender gender;

    private Designation designation;

    private EmpType emptype;

    private Employeestatus employeestatus;

    public EmployeeDTO(Integer id, String fullname, String number,Designation designation) {
        this.id = id;
        this.fullname = fullname;
        this.number = number;
        this.designation = designation;
    }
}
