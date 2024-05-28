package com.content.security.dto;

import com.content.security.entity.Role;
import com.content.security.entity.UserStatus;
import com.content.security.entity.UserType;
import lombok.*;

import java.util.Set;

@Data
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenDTO {

    private String accessToken;

    private String refreshToken;
}
