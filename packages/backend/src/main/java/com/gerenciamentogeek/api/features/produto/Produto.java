package com.gerenciamentogeek.api.features.produto;

import com.gerenciamentogeek.api.features.categoria.Categoria;
import jakarta.persistence.*;

@Entity
@Table(name="tbProduto")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomeProd")
    private String nomeProd;

    @Column(name = "descProd")
    private String descProd;

    @Column(name = "preco")
    private Double preco;

    @Column(name = "qtdEstoque")
    private int qtdEstoque;

    @Column(name = "codigoProd")
    private int codigoProd;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    public Produto() {}

    public Produto(String nomeProd, String descProd, Double preco, int qtdEstoque, int codigoProd, Categoria categoria) {
        if (nomeProd == null || nomeProd.isBlank()) throw new IllegalArgumentException("O nome do produto é obrigatório.");
        if (preco == null || preco <= 0) throw new IllegalArgumentException("O preço deve ser maior que zero.");
        if (codigoProd <= 0) throw new IllegalArgumentException("O código é obrigatório.");

        this.nomeProd = nomeProd;
        this.descProd = descProd;
        this.preco = preco;
        this.qtdEstoque = qtdEstoque;
        this.codigoProd = codigoProd;
        this.categoria = categoria;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeProd() { return nomeProd; }
    public void setNomeProd(String n) { this.nomeProd = n; }
    public String getDescProd() { return descProd; }
    public void setDescProd(String d) { this.descProd = d; }
    public Double getPreco() { return preco; }
    public void setPreco(Double p) { this.preco = p; }
    public int getQtdEstoque() { return qtdEstoque; }
    public void setQtdEstoque(int q) { this.qtdEstoque = q; }
    public int getCodigoProd() { return codigoProd; }
    public void setCodigoProd(int c) { this.codigoProd = c; }
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria c) { this.categoria = c; }
}