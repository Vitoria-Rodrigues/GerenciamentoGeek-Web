package com.gerenciamentogeek.api.core.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.token.secret:ggeek-secret-key}")
    private String segredo;

    public String gerarToken(String login) {
        try {
            var algoritmo = Algorithm.HMAC256(segredo);
            return JWT.create()
                    .withIssuer("GGeek API")
                    .withSubject(login)
                    .withExpiresAt(obterDataExpiracao())
                    .sign(algoritmo);
        } catch (JWTCreationException excecao) {
            throw new RuntimeException("Erro ao gerar token", excecao);
        }
    }

    public String validarToken(String tokenJWT) {
        try {
            var algoritmo = Algorithm.HMAC256(segredo);
            return JWT.require(algoritmo)
                    .withIssuer("GGeek API")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();
        } catch (JWTVerificationException excecao) {
            return null;
        }
    }

    private Instant obterDataExpiracao() {
        return LocalDateTime.now().plusHours(8).toInstant(ZoneOffset.of("-03:00"));
    }
}