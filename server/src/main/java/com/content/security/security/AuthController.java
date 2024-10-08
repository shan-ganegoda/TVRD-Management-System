package com.content.security.security;

import com.content.security.dto.AuthUser;
import com.content.security.dto.AuthenticationRequest;
import com.content.security.dto.AuthenticationResponse;
import com.content.security.dto.RegisterRequest;
import com.content.security.entity.User;
import com.content.security.service.AuthService;
import com.content.security.service.UserService;
import com.content.security.util.StandardResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieProvider cookieProvider;
    private final UserService userService;

//    @GetMapping
//    public List<User> getAll(){
//        return authService.getAll();
//    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthUser> authenticate(@RequestBody AuthenticationRequest request, HttpServletResponse response){
        AuthenticationResponse auth = authService.authenticate(request);
        response.addCookie(cookieProvider.createAuthCookie(auth.getAccessToken()));
        response.addCookie(cookieProvider.createRefreshCookie(auth.getRefreshToken()));

        return ResponseEntity.ok(auth.getAuthUser());
    }

    @GetMapping("/refresh")
    public void refreshToken(HttpServletRequest request,HttpServletResponse response) throws IOException {
        Cookie refreshCookie = WebUtils.getCookie(request,"refreshToken");

        if(refreshCookie != null){
            AuthenticationResponse authResponse = authService.refreshToken(refreshCookie.getValue());
            response.addCookie(cookieProvider.createAuthCookie(authResponse.getAccessToken()));
        }
    }

    @PostMapping(path = "/check")
    public ResponseEntity<StandardResponse> checkUser(@RequestBody HashMap<String,String> request){
//        System.out.println(request.get("forgetemail"));
        String message =  userService.checkUser(request.get("forgetemail"));

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Done",message), HttpStatus.OK
        );
    }
}
