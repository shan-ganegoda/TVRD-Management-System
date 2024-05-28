package com.content.security.dto;

import com.content.security.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthorityDTO {

    private Integer id;
    private Role role;
    private ModuleDTO module;
    private OperationDTO operation;
}
