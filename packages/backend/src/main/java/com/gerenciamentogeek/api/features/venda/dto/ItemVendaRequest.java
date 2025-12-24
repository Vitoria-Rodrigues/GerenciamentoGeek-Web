package com.gerenciamentogeek.api.features.venda.dto;

import jakarta.validation.constraints.Positive;

public record ItemVendaRequest(
        @Positive(message = "ID do produto inválido")
        Long idProduto,

        @Positive(message = "Quantidade deve ser maior que zero")
        int qtdProduto
) {}