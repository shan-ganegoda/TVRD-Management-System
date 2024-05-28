package com.content.security.security;

import com.content.security.dto.TokenDTO;
import com.content.security.entity.RevokedToken;
import com.content.security.repository.RevokedTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    private final RevokedTokenRepository revokedTokenRepository;

    //check if the token is revoked or not
    public boolean isRevokedToken(String token){
        return revokedTokenRepository.existsByToken(token);
    }

    //this method is use to revoke if any tokens has expired
    public void revokeToken(TokenDTO tokens){
        if(!tokens.getAccessToken().isEmpty()){
            RevokedToken accessToken = RevokedToken.builder()
                    .token(tokens.getAccessToken())
                    .expirationdate(extractExpiration(tokens.getAccessToken()).toInstant())
                    .build();

            revokedTokenRepository.save(accessToken);
        }

        if(!tokens.getRefreshToken().isEmpty()){
            RevokedToken refreshToken = RevokedToken.builder()
                    .token(tokens.getRefreshToken())
                    .expirationdate(extractExpiration(tokens.getAccessToken()).toInstant())
                    .build();

            revokedTokenRepository.save(refreshToken);
        }
    }

    //to delete all the revoked tokens after time to clean database space
    public void deleteRevokeTokens(){
        List<RevokedToken> expiredTokens = revokedTokenRepository.findAllByExpirationdateBefore(Instant.now());
        revokedTokenRepository.deleteAll(expiredTokens);
    }

    //Extract Username From the JwtToken
    public String extractUsername(String token) {
        return extractClaim(token,Claims::getSubject);
    }

    //Extract all the claims from your jwtToken
    private Claims extractAllClaims(String token){
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

//    this method is to decode a BASE64-encoded secret key (SECRET_KEY) and convert it into a
//    Key object suitable for use in HMAC-based JWT signing and verification.
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    //extract single claim from jwt
    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    //generate a jwtToken with  UserDetails Only
    public String generateToken(UserDetails userDetails){
        return generateToken( new HashMap<String,Object>(),userDetails);
    }

    //generate a jwtToken with extraClaims and UserDetails
    public String generateToken(
            Map<String,Object> extraClaims,
            UserDetails userDetails
    ){
            return buildToken(extraClaims,userDetails,jwtExpiration);
    }

    //generate a refreshToken
    public String generateRefreshToken(
            UserDetails userDetails
    ){
        return buildToken(new HashMap<String,Object>(),userDetails,refreshExpiration);
    }


    //build tokens
    private String buildToken(
            Map<String,Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token,UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token,Claims::getExpiration);
    }

}
