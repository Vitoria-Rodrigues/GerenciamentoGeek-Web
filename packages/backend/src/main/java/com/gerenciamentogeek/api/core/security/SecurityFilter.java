package com.gerenciamentogeek.api.core.security;

import com.gerenciamentogeek.api.features.funcionario.FuncionarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;
    @Autowired
    private FuncionarioRepository repositorio;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var tokenJWT = recuperarToken(request);
        if (tokenJWT != null) {
            var login = tokenService.validarToken(tokenJWT);
            if (login != null) {
                var funcionario = repositorio.findByLoginLogin(login);
                if (funcionario != null) {
                    var autenticacao = new UsernamePasswordAuthenticationToken(funcionario, null, funcionario.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(autenticacao);
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var cabecalhoAutorizacao = request.getHeader("Authorization");
        if (cabecalhoAutorizacao != null) {
            return cabecalhoAutorizacao.replace("Bearer ", "");
        }
        return null;
    }
}