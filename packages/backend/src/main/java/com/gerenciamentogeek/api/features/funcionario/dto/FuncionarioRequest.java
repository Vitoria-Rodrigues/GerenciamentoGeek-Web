package com.gerenciamentogeek.api.features.funcionario.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.br.CPF;

public record FuncionarioRequest(
        @NotBlank(message = "Funcionário é obrigatório")
        String nome,

        @NotBlank(message = "CPF é obrigatório")
        @CPF(message = "CPF inválido")
        String cpf,

        @NotBlank(message = "Logradouro é obrigatório")
        String logradouro,

        @NotBlank(message = "CEP é obrigatório")
        String cep,

        @NotBlank(message = "Telefone é obrigatório")
        @Pattern(regexp = "^\\(?\\d{2}\\)?[\\s-]?\\d{4,5}-?\\d{4}$")
        String telefone,

        @NotBlank(message = "Número é obrigatório")
        String numero,

        @NotBlank(message = "Complemento é obrigatório")
        String complemento,

        @NotBlank(message = "Login é obrigatório")
        String login,

        @NotBlank(message = "Senha é obrigatório")
        String senha,

        @Positive(message = "Cargo é obrigatório")
        Long cargo
) {}