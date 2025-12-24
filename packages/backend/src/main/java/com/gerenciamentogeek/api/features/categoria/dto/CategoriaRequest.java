package com.gerenciamentogeek.api.features.categoria.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoriaRequest(
        @NotBlank(message = "O nome da categoria é obrigatório")
        String nomeCateg
) {}