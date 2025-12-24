package com.gerenciamentogeek.api.features.produto;

import com.gerenciamentogeek.api.features.categoria.Categoria;
import com.gerenciamentogeek.api.features.categoria.CategoriaRepository;
import com.gerenciamentogeek.api.features.produto.dto.ProdutoRequest;
import com.gerenciamentogeek.api.features.produto.dto.ProdutoResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProdutoService {
    private final ProdutoRepository repository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository repository, CategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }

    public ProdutoResponse cadastrarProduto(ProdutoRequest dados) {
        Categoria c = categoriaRepository.findById(dados.categoria()).orElseThrow();
        Produto p = new Produto(dados.nome(), dados.desc(), dados.preco(), dados.qtdEstoque(), dados.codigo(), c);
        return new ProdutoResponse(repository.save(p));
    }

    public List<ProdutoResponse> listarProdutos(int cod) {
        if (cod == 0) return repository.findAll().stream().map(ProdutoResponse::new).toList();
        return repository.findByCodigoProd(cod).stream().map(ProdutoResponse::new).toList();
    }

    public ProdutoResponse editarProduto(ProdutoRequest dados, Long id) {
        Produto p = repository.findById(id).orElseThrow();
        Categoria c = categoriaRepository.findById(dados.categoria()).orElseThrow();
        p.setNomeProd(dados.nome());
        p.setDescProd(dados.desc());
        p.setPreco(dados.preco());
        p.setQtdEstoque(dados.qtdEstoque());
        p.setCodigoProd(dados.codigo());
        p.setCategoria(c);
        return new ProdutoResponse(repository.save(p));
    }

    public void excluirProduto(Long id) {
        repository.deleteById(id);
    }
}