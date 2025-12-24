package com.gerenciamentogeek.api.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record Response<T>(
        String status,
        String mensagem,
        T data
) {
    public Response(String status, String mensagem) {
        this(status, mensagem, null);
    }
}