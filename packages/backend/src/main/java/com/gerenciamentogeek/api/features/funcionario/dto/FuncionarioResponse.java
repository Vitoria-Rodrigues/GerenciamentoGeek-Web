package com.gerenciamentogeek.api.features.funcionario.dto;

import com.gerenciamentogeek.api.features.funcionario.Funcionario;

public record FuncionarioResponse(
        Long id,
        String nome,
        String cpf,
        String logradouro,
        String cep,
        String telefone,
        String numero,
        String complemento,
        String login,
        String cargo
) {
    public FuncionarioResponse(Funcionario f) {
        this(
                f.getId(),
                f.getNomeF(),
                f.getCpfF(),
                f.getLogradouro(),
                f.getCep(),
                f.getTelefoneF(),
                f.getNumero(),
                f.getComplemento(),
                f.getLogin().getLogin(),
                f.getCargo().getFuncao()
        );
    }
}