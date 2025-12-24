package com.gerenciamentogeek.api.features.cliente;

import com.gerenciamentogeek.api.core.dto.Response;
import com.gerenciamentogeek.api.features.cliente.dto.ClienteRequest;
import com.gerenciamentogeek.api.features.cliente.dto.ClienteResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<Response<ClienteResponse>> salvar(@RequestBody @Valid ClienteRequest dados) {
        try {
            ClienteResponse res = clienteService.salvarCliente(dados);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new Response<>("Sucesso", "Cliente cadastrado com sucesso!", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Response<>("Erro", "Erro ao cadastrar cliente: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<ClienteResponse>>> listar() {
        var res = clienteService.listarClientes();
        return ResponseEntity.ok(new Response<>("Sucesso", "Lista de clientes recuperada", res));
    }

    @GetMapping("/buscar-cpf/{cpf}")
    public ResponseEntity<Response<ClienteResponse>> buscarPorCpf(@PathVariable String cpf) {
        try {
            ClienteResponse res = clienteService.buscarPorCPF(cpf);
            return ResponseEntity.ok(new Response<>("Sucesso", "Cliente encontrado", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Response<>("Erro", "Cliente não encontrado"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<ClienteResponse>> editar(@PathVariable Long id, @RequestBody @Valid ClienteRequest dados) {
        try {
            ClienteResponse res = clienteService.editarCliente(dados, id);
            return ResponseEntity.ok(new Response<>("Sucesso", "Dados do cliente editados com sucesso!", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Response<>("Erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deletar(@PathVariable Long id) {
        try {
            clienteService.excluirCliente(id);
            return ResponseEntity.ok(new Response<>("Sucesso", "Cliente deletado com sucesso!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Response<>("Erro", e.getMessage()));
        }
    }
}