package com.gerenciamentogeek.api.features.venda;

import jakarta.persistence.*;

@Entity
@Table(name = "tbPagamento")
public class FormaPagamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "metodoPag")
    private String metodoPag;

    @Column(name = "parcelasPag")
    private int parcelasPag;

    @OneToOne
    @JoinColumn(name = "venda_id", unique = true)
    private Venda venda;

    public FormaPagamento() {}

    public FormaPagamento(String metodoPag, int parcelasPag) {
        this.metodoPag = metodoPag;
        this.parcelasPag = parcelasPag;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMetodoPag() { return metodoPag; }
    public void setMetodoPag(String m) { this.metodoPag = m; }
    public int getParcelasPag() { return parcelasPag; }
    public void setParcelasPag(int p) { this.parcelasPag = p; }
    public Venda getVenda() { return venda; }
    public void setVenda(Venda v) { this.venda = v; }
}