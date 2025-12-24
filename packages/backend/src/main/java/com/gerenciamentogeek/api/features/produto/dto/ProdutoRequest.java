package com.gerenciamentogeek.api.features.produto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record ProdutoRequest(
        @NotBlank String nome,
        @NotBlank String desc,
        @Positive Double preco,
        @PositiveOrZero int qtdEstoque,
        @Positive int codigo,
        @Positive Long categoria
) {}