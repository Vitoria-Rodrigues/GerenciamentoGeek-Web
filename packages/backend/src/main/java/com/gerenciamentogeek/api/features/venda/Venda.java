package com.gerenciamentogeek.api.features.venda;

import com.gerenciamentogeek.api.features.cliente.Cliente;
import com.gerenciamentogeek.api.features.funcionario.Funcionario;
import com.gerenciamentogeek.api.features.produto.Produto;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="tbVenda")
public class Venda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "dataVenda")
    private LocalDate dataVenda;

    @Column(name = "totalVenda")
    private Double totalVenda;

    @Column(name = "qtdVenda")
    private int qtdVenda;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

    @OneToOne(mappedBy = "venda", cascade=CascadeType.ALL)
    private FormaPagamento formapagamento;

    @ManyToMany
    @JoinTable(
            name = "tbItemVenda",
            joinColumns = @JoinColumn(name = "venda_id"),
            inverseJoinColumns = @JoinColumn(name = "produto_id")
    )
    private List<Produto> prod = new ArrayList<>();

    public Venda() {}

    public Venda(LocalDate dataVenda, Double totalVenda, int qtdVenda, Cliente cliente, Funcionario funcionario, FormaPagamento formapagamento) {
        this.dataVenda = dataVenda;
        this.totalVenda = totalVenda;
        this.qtdVenda = qtdVenda;
        this.cliente = cliente;
        this.funcionario = funcionario;
        this.formapagamento = formapagamento;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDate getDataVenda() { return dataVenda; }
    public void setDataVenda(LocalDate d) { this.dataVenda = d; }
    public Double getTotalVenda() { return totalVenda; }
    public void setTotalVenda(Double t) { this.totalVenda = t; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente c) { this.cliente = c; }
    public Funcionario getFuncionario() { return funcionario; }
    public void setFuncionario(Funcionario f) { this.funcionario = f; }
    public List<Produto> getProd() { return prod; }
    public void setProd(List<Produto> p) { this.prod = p; }
    public int getQtdVenda() { return qtdVenda; }
    public void setQtdVenda(int q) { this.qtdVenda = q; }
    public FormaPagamento getFormapagamento() { return formapagamento; }
    public void setFormapagamento(FormaPagamento f) { this.formapagamento = f; }
}