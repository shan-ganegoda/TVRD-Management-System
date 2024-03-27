package com.content.security.service;

import com.content.security.dto.AuthenticationRequest;
import com.content.security.dto.AuthenticationResponse;
import com.content.security.dto.RegisterRequest;
import com.content.security.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public interface AuthService {
    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);

    AuthenticationResponse refreshToken(String token);

//    List<User> getAll();
}
