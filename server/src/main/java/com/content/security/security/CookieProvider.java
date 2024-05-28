package com.content.security.security;

import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CookieProvider {

    @Value("${application.security.jwt.expiration}")
    int accessTokenExpirationMs;

    @Value("${application.security.jwt.refresh-token.expiration}")
    int refreshTokenExpirationMs;

    public Cookie createAuthCookie(String token){
        Cookie authCookie = new Cookie("accessToken",token);
        authCookie.setSecure(false);
        authCookie.setHttpOnly(true);
        authCookie.setPath("/");
        authCookie.setMaxAge(accessTokenExpirationMs / 1000);

        return authCookie;
    }

    public Cookie createRefreshCookie(String token){
        Cookie refreshCookie = new Cookie("refreshToken",token);
        refreshCookie.setSecure(false);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/api/v1/auth");
        refreshCookie.setMaxAge(refreshTokenExpirationMs / 1000);

        return refreshCookie;

    }
}
