package com.content.security.service;

import com.content.security.config.ApplicationConfig;
import com.content.security.dto.*;
import com.content.security.entity.*;
//import com.content.security.repository.TokenRepository;
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

        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        //var userDto = objectMapper.userToUserDTO(Optional.of(user));
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        //revokeAllTokens(user);
        //saveUserToken(user,jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .authUser(
                        AuthUser.builder()
                                .user(user)
                                .authorities(getUserAuthoritiesByUsername(request.getEmail()))
                                .build()
                )
                .build();
    }

    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;

        if(!StringUtils.hasLength(authHeader) || !StringUtils.startsWithIgnoreCase(authHeader, "Bearer ")){
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);

        //.hasText - this method returns true if the String is not null, its length is greater
        //           than 0, and it contains at least one non-whitespace character.
        if(StringUtils.hasText(userEmail)){
            var user = this.userRepository.findByEmail(userEmail).orElseThrow();
            var userDto = userService.getUserByEmail(userEmail);

            if(jwtService.isTokenValid(refreshToken,user)){
                var accessToken = jwtService.generateToken(user);
                //revokeAllTokens(user);
                //saveUserToken(user,accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .authUser(
                                AuthUser.builder()
                                        .user(user)
                                        .authorities(getUserAuthoritiesByUsername(userDto.getEmail()))
                                        .build()
                        )
                        .build();
            }
        }
    }


//    private void revokeAllTokens(User user){
//        var validTokens = tokenRepository.findAllValidTokensByUser(user.getId());
//
//        if(validTokens.isEmpty()){ return; }
//        validTokens.forEach(t->{
//            t.setExpired(true);
//            t.setRevoked(true);
//        });
//
//        tokenRepository.saveAll(validTokens);
//
//    }

//    private void saveUserToken(User savedUser, String jwtToken) {
//        var token = Token.builder()
//                .user(savedUser)
//                .token(jwtToken)
//                .tokenType(TokenType.BEARER)
//                .isExpired(false)
//                .isRevoked(false)
//                .build();
//        //tokenRepository.save(token);
//    }

    private List<String> getUserAuthoritiesByUsername(String username){
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        return userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).toList();
    }
}
