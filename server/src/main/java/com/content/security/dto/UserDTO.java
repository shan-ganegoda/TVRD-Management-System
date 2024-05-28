package com.content.security.dto;

import com.content.security.entity.Authority;
import com.content.security.entity.Role;
//import com.content.security.entity.Token;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO{


    private Integer id;

    private String firstname;

    private String lastname;

    private String email;

    private String password;

    private Set<Role> roles;

    private EmployeeDTO employee;

//    private List<Token> tokenList;


}

