package com.gerenciamentogeek.api.features.login.dto;

public record LoginResponse(
        Long idFuncionario,
        String nome,
        String login,
        String cargo,
        String token
) {}