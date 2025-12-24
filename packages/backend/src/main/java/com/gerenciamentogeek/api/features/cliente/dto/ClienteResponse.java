package com.gerenciamentogeek.api.features.cliente.dto;

import com.gerenciamentogeek.api.features.cliente.Cliente;

public record ClienteResponse(
        Long id,
        String nome,
        String cpf,
        String sexo,
        String telefone
) {
    public ClienteResponse(Cliente c) {
        this(
                c.getId(),
                c.getNomeC(),
                c.getCpfC(),
                c.getSexoC(),
                c.getTelefoneC()
        );
    }
}