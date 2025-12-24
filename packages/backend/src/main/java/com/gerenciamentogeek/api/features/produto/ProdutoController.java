package com.gerenciamentogeek.api.features.produto;

import com.gerenciamentogeek.api.core.dto.Response;
import com.gerenciamentogeek.api.features.produto.dto.ProdutoRequest;
import com.gerenciamentogeek.api.features.produto.dto.ProdutoResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {
    private final ProdutoService productService;

    public ProdutoController(ProdutoService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<Response<ProdutoResponse>> salvar(@RequestBody @Valid ProdutoRequest dados) {
        try {
            var res = productService.cadastrarProduto(dados);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response<>("Sucesso", "Produto salvo", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response<>("Erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<ProdutoResponse>>> listar() {
        var res = productService.listarProdutos(0);
        return ResponseEntity.ok(new Response<>("Sucesso", "Produtos listados", res));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<ProdutoResponse>> editar(@PathVariable Long id, @RequestBody @Valid ProdutoRequest dados) {
        try {
            var res = productService.editarProduto(dados, id);
            return ResponseEntity.ok(new Response<>("Sucesso", "Produto editado", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response<>("Erro", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deletar(@PathVariable Long id) {
        try {
            productService.excluirProduto(id);
            return ResponseEntity.ok(new Response<>("Sucesso", "Produto deletado"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response<>("Erro", e.getMessage()));
        }
    }
}