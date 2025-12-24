package com.gerenciamentogeek.api.features.cargo.dto;

import com.gerenciamentogeek.api.features.cargo.Cargo;

public record CargoResponse(
        Long id,
        String funcao
) {
    public CargoResponse(Cargo c) {
        this(c.getId(), c.getFuncao());
    }
}