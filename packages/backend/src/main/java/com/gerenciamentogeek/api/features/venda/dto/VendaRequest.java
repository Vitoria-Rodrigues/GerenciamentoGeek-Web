package com.gerenciamentogeek.api.features.venda.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.List;

public record VendaRequest(
        LocalDate data,

        @Positive(message = "Total é obrigatório")
        Double total,

        @Positive(message = "Quantidade total inválida")
        int qtd,

        @NotBlank(message = "CPF do cliente é obrigatório")
        String cpfCliente,

        @Positive(message = "ID do funcionário é obrigatório")
        Long idFuncionario,

        @NotBlank(message = "Forma de pagamento é obrigatória")
        String formaPagamento,

        int parcelasPagamento,

        @NotEmpty(message = "A venda deve conter pelo menos um item")
        List<ItemVendaRequest> itemVenda
) {}