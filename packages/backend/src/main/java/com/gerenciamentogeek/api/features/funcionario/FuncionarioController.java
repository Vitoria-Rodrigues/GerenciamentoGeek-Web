package com.gerenciamentogeek.api.features.funcionario;

import com.gerenciamentogeek.api.core.dto.Response;
import com.gerenciamentogeek.api.features.funcionario.dto.FuncionarioRequest;
import com.gerenciamentogeek.api.features.funcionario.dto.FuncionarioResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {
    @Autowired
    private FuncionarioService service;

    @PostMapping
    public ResponseEntity<Response<FuncionarioResponse>> salvar(@RequestBody @Valid FuncionarioRequest dados) {
        try {
            var res = service.salvarFuncionario(dados);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response<>("Sucesso", "Funcionário cadastrado", res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response<>("Erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<FuncionarioResponse>>> listar() {
        var res = service.listarFuncionarios();
        return ResponseEntity.ok(new Response<>("Sucesso", "Funcionários listados", res));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<FuncionarioResponse>> buscar(@PathVariable Long id) {
        try {
            var res = service.buscarPorId(id);
            return ResponseEntity.ok(new Response<>("Sucesso", "Funcionário encontrado", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response<>("Erro", "Funcionário não encontrado"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<FuncionarioResponse>> editar(@PathVariable Long id, @RequestBody @Valid FuncionarioRequest dados) {
        try {
            var res = service.editarFuncionario(dados, id);
            return ResponseEntity.ok(new Response<>("Sucesso", "Funcionário editado", res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new Response<>("Erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deletar(@PathVariable Long id) {
        try {
            service.excluirFuncionario(id);
            return ResponseEntity.ok(new Response<>("Sucesso", "Funcionário deletado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response<>("Erro", e.getMessage()));
        }
    }
}