package com.gerenciamentogeek.api.features.categoria.dto;

import com.gerenciamentogeek.api.features.categoria.Categoria;

public record CategoriaResponse(
        Long id,
        String nomeCateg
) {
    public CategoriaResponse(Categoria c) {
        this(c.getId(), c.getNomeCateg());
    }
}