package com.gerenciamentogeek.api.features.produto.dto;

import com.gerenciamentogeek.api.features.produto.Produto;

public record ProdutoResponse(
        Long id,
        String nome,
        String desc,
        Double preco,
        int qtdEstoque,
        int codigo,
        String categoria
) {
    public ProdutoResponse(Produto p) {
        this(p.getId(), p.getNomeProd(), p.getDescProd(), p.getPreco(), p.getQtdEstoque(), p.getCodigoProd(), p.getCategoria().getNomeCateg());
    }
}