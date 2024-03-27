package com.content.security.dto;

import com.content.security.entity.Role;
import com.content.security.entity.UserStatus;
import com.content.security.entity.UserType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String email;

    private String password;

    private Set<Role> roles;

    private UserType userType;

    private UserStatus userStatus;

    private String description;
}
