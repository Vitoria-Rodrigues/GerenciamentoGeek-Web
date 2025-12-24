package com.gerenciamentogeek.api.features.categoria;

import com.gerenciamentogeek.api.core.dto.Response;
import com.gerenciamentogeek.api.features.categoria.dto.CategoriaRequest;
import com.gerenciamentogeek.api.features.categoria.dto.CategoriaResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    public ResponseEntity<Response<CategoriaResponse>> salvar(@RequestBody @Valid CategoriaRequest dados) {
        try {
            CategoriaResponse res = categoriaService.salvarCategoria(dados);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new Response<>("Sucesso", "Categoria criada com sucesso!", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Response<>("Erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<CategoriaResponse>>> listar() {
        var res = categoriaService.listarCategorias();
        return ResponseEntity.ok(new Response<>("Sucesso", "Categorias listadas", res));
    }
}