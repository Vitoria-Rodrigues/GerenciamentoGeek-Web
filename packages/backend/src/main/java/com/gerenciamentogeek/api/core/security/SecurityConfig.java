package com.gerenciamentogeek.api.core.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(req -> {
                    req.requestMatchers(HttpMethod.POST, "/login").permitAll();

                    req.requestMatchers("/funcionarios/**").hasAnyRole("ADMINISTRADOR", "GERENTE");

                    req.requestMatchers(HttpMethod.GET, "/produtos/**").hasAnyRole("ADMINISTRADOR", "GERENTE", "ATENDENTE", "CAIXA");
                    req.requestMatchers("/produtos/**").hasAnyRole("ADMINISTRADOR", "GERENTE", "ATENDENTE");

                    req.requestMatchers(HttpMethod.DELETE, "/vendas/**").hasRole("ADMINISTRADOR");
                    req.requestMatchers(HttpMethod.GET, "/vendas", "/vendas/**").hasAnyRole("ADMINISTRADOR", "GERENTE");
                    req.requestMatchers(HttpMethod.POST, "/vendas").hasAnyRole("ADMINISTRADOR", "GERENTE", "ATENDENTE", "CAIXA");

                    req.requestMatchers(HttpMethod.DELETE, "/clientes/**").hasAnyRole("ADMINISTRADOR", "GERENTE");
                    req.requestMatchers(HttpMethod.GET, "/clientes", "/clientes/**").hasAnyRole("ADMINISTRADOR", "GERENTE");
                    req.requestMatchers(HttpMethod.POST, "/clientes").hasAnyRole("ADMINISTRADOR", "GERENTE", "ATENDENTE", "CAIXA");

                    req.requestMatchers("/clientes/**").authenticated();
                    req.requestMatchers("/categorias/**").hasAnyRole("ADMINISTRADOR", "GERENTE", "ATENDENTE");
                    req.requestMatchers("/cargos/**").hasAnyRole("ADMINISTRADOR", "GERENTE");

                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://vitoria-rodrigues.github.io", "http://localhost:5173", "http://127.0.0.1:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
