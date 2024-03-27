package com.content.security.service;

import com.content.security.config.ApplicationConfig;
import com.content.security.dto.*;
import com.content.security.entity.*;
//import com.content.security.repository.TokenRepository;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.UserRepository;
import com.content.security.security.JwtService;
import com.content.security.util.mapper.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceIMPL implements AuthService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final ObjectMapper objectMapper;
//    private final TokenRepository tokenRepository;

    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(request.getRoles())
                .docreated(Date.valueOf(LocalDate.now()))
                .tocreated(Time.valueOf(LocalTime.now()))
                .usertype(request.getUserType())
                .userstatus(request.getUserStatus())
                .description(request.getDescription())
                .build();

        var savedUser = userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        //saveUserToken(savedUser, jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }



    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        UserDTO userDto = objectMapper.userToUserDTO(user);
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .authUser(
                        AuthUser.builder()
                                .user(userDto)
                                .authorities(getUserAuthoritiesByUsername(request.getEmail()))
                                .build()
                )
                .build();
    }

    @Override
    public AuthenticationResponse refreshToken(String token) {

        User user = userRepository.findByEmail(jwtService.extractUsername(token)).orElseThrow();
        UserDTO userdto = objectMapper.userToUserDTO(user);

        if (
                jwtService.isTokenValid(token, user)
        ) {
            String accessToken = jwtService.generateToken(user);

            return AuthenticationResponse.builder()
                    .accessToken(accessToken)
                    .authUser(
                            AuthUser.builder()
                                    .user(userdto)
                                    .authorities(getUserAuthoritiesByUsername(user.getEmail()))
                                    .build()
                    )
                    .build();
        }else throw new ResourceNotFountException("Invalid Refresh Token");//need to be an Authentication Exception
    }

    private List<String> getUserAuthoritiesByUsername(String username){
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        return userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList();
    }
}
