package com.gerenciamentogeek.api.features.login;

import com.gerenciamentogeek.api.core.dto.Response;
import com.gerenciamentogeek.api.features.funcionario.Funcionario;
import com.gerenciamentogeek.api.features.login.dto.LoginRequest;
import com.gerenciamentogeek.api.features.login.dto.LoginResponse;
import com.gerenciamentogeek.api.core.security.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {
    @Autowired private LoginService loginService;
    @Autowired private TokenService tokenService;

    @PostMapping
    public ResponseEntity<Response<LoginResponse>> efetuarLogin(@RequestBody @Valid LoginRequest dados) {
        try {
            var f = loginService.validarCredenciais(dados);
            var t = tokenService.gerarToken(f.getLogin().getLogin());
            var res = new LoginResponse(f.getId(), f.getNomeF(), f.getLogin().getLogin(), f.getCargo().getFuncao().toUpperCase(), t);
            return ResponseEntity.ok(new Response<>("Sucesso", "Login efetuado", res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response<>("Erro", "Falha na autenticação"));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<Response<LoginResponse>> verificarToken() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        var f = (Funcionario) auth.getPrincipal();
        var res = new LoginResponse(f.getId(), f.getNomeF(), f.getUsername(), f.getCargo().getFuncao().toUpperCase(), null);
        return ResponseEntity.ok(new Response<>("Sucesso", "Sessão válida", res));
    }
}