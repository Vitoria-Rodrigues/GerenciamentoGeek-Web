package com.gerenciamentogeek.api.features.cliente;

import com.gerenciamentogeek.api.features.cliente.dto.ClienteRequest;
import com.gerenciamentogeek.api.features.cliente.dto.ClienteResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository repository;

    public ClienteResponse salvarCliente(ClienteRequest dados) {
        Cliente c = new Cliente(dados.nome(), dados.cpf(), dados.sexo(), dados.telefone());
        return new ClienteResponse(repository.save(c));
    }

    public List<ClienteResponse> listarClientes() {
        return repository.findAll().stream().map(ClienteResponse::new).toList();
    }

    public ClienteResponse buscarPorCPF(String cpf) {
        return repository.buscarPorCpf(cpf).map(ClienteResponse::new).orElseThrow();
    }

    public ClienteResponse editarCliente(ClienteRequest dados, Long id) {
        Cliente c = repository.findById(id).orElseThrow();
        c.setNomeC(dados.nome());
        c.setCpfC(dados.cpf());
        c.setSexoC(dados.sexo());
        c.setTelefoneC(dados.telefone());
        return new ClienteResponse(repository.save(c));
    }

    public void excluirCliente(Long id) {
        repository.deleteById(id);
    }
}