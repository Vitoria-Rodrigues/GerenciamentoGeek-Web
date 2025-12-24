package com.gerenciamentogeek.api.features.venda;

import com.gerenciamentogeek.api.core.dto.Response;
import com.gerenciamentogeek.api.features.venda.dto.VendaRequest;
import com.gerenciamentogeek.api.features.venda.dto.VendaResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vendas")
public class VendaController {
    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @PostMapping
    public ResponseEntity<Response<VendaResponse>> salvar(@RequestBody @Valid VendaRequest dados) {
        try {
            var res = vendaService.cadastrarVenda(dados);
            return ResponseEntity.status(HttpStatus.CREATED).body(new Response<>("Sucesso", "Venda realizada", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Response<>("Erro", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Response<List<VendaResponse>>> listarTodas() {
        try {
            var res = vendaService.listarVendas(null);
            return ResponseEntity.ok(new Response<>("Sucesso", "Todas as vendas listadas", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new Response<>("Erro", e.getMessage()));
        }
    }

    @GetMapping("/{cpfC}")
    public ResponseEntity<Response<List<VendaResponse>>> listarPorCpf(@PathVariable String cpfC) {
        try {
            var res = vendaService.listarVendas(cpfC);
            return ResponseEntity.ok(new Response<>("Sucesso", "Vendas do cliente listadas", res));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response<>("Erro", e.getMessage()));
        }
    }
}