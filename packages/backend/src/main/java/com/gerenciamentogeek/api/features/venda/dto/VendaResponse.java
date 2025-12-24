package com.gerenciamentogeek.api.features.venda.dto;

import com.gerenciamentogeek.api.features.venda.Venda;
import java.time.LocalDate;

public record VendaResponse(
        Long id,
        LocalDate data,
        Double total,
        String cpfCliente
) {
    public VendaResponse(Venda v) {
        this(
                v.getId(),
                v.getDataVenda(),
                v.getTotalVenda(),
                v.getCliente().getCpfC()
        );
    }
}