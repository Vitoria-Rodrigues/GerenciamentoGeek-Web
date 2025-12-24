package com.gerenciamentogeek.api.features.login;

import com.gerenciamentogeek.api.features.funcionario.Funcionario;
import com.gerenciamentogeek.api.features.funcionario.FuncionarioRepository;
import com.gerenciamentogeek.api.features.login.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Funcionario validarCredenciais(LoginRequest dados) {
        Funcionario funcionario = funcionarioRepository.findByLoginLogin(dados.login());

        if (funcionario != null && passwordEncoder.matches(dados.senha(), funcionario.getLogin().getSenha())) {
            return funcionario;
        }

        throw new RuntimeException("Credenciais inválidas");
    }
}