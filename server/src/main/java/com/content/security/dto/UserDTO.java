package com.content.security.dto;

import com.content.security.entity.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Date;
import java.sql.Time;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO{


    private Integer id;

    @Pattern(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid Email")
    private String email;

    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$", message = "Invalid Password")
    private String password;

    private Set<Role> roles;

    private EmployeeDTO employee;

    private Date docreated;

    private Time tocreated;

    private UserStatus userstatus;

    private UserType usertype;

    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;


}

