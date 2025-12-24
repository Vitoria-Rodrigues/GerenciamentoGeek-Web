package com.gerenciamentogeek.api.features.funcionario;

import com.gerenciamentogeek.api.features.cargo.Cargo;
import com.gerenciamentogeek.api.features.cargo.CargoRepository;
import com.gerenciamentogeek.api.features.funcionario.dto.FuncionarioRequest;
import com.gerenciamentogeek.api.features.funcionario.dto.FuncionarioResponse;
import com.gerenciamentogeek.api.features.login.Login;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FuncionarioService {
    @Autowired
    private FuncionarioRepository repository;
    @Autowired
    private CargoRepository cargoRepository;
    @Autowired
    private PasswordEncoder encoder;

    public FuncionarioResponse salvarFuncionario(FuncionarioRequest dados) {
        Cargo cargo = cargoRepository.findById(dados.cargo()).orElseThrow();
        Login login = new Login(dados.login(), encoder.encode(dados.senha()));
        Funcionario f = new Funcionario(dados.nome(), dados.cpf(), dados.logradouro(), dados.cep(), dados.numero(), dados.complemento(), dados.telefone(), login, cargo);
        login.setFuncionario(f);
        repository.save(f);
        return new FuncionarioResponse(f);
    }

    public List<FuncionarioResponse> listarFuncionarios() {
        return repository.findAll().stream().map(FuncionarioResponse::new).toList();
    }

    public FuncionarioResponse buscarPorId(Long id) {
        return repository.findById(id).map(FuncionarioResponse::new).orElseThrow();
    }

    public FuncionarioResponse editarFuncionario(FuncionarioRequest dados, Long id) {
        Funcionario f = repository.findById(id).orElseThrow();
        Cargo c = cargoRepository.findById(dados.cargo()).orElseThrow();
        f.setNomeF(dados.nome());
        f.setCpfF(dados.cpf());
        f.setLogradouro(dados.logradouro());
        f.setCep(dados.cep());
        f.setNumero(dados.numero());
        f.setComplemento(dados.complemento());
        f.setTelefoneF(dados.telefone());
        f.setCargo(c);
        f.getLogin().setLogin(dados.login());
        if (dados.senha() != null && !dados.senha().isBlank()) f.getLogin().setSenha(encoder.encode(dados.senha()));
        repository.save(f);
        return new FuncionarioResponse(f);
    }

    public void excluirFuncionario(Long id) {
        repository.deleteById(id);
    }
}