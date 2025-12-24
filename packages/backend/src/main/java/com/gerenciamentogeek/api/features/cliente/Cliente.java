package com.gerenciamentogeek.api.features.cliente;

import com.gerenciamentogeek.api.features.venda.Venda;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="tbCliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomeC")
    private String nomeC;

    @Column(name = "cpfC")
    private String cpfC;

    @Column(name = "sexoC")
    private String sexoC;

    @Column(name = "telefoneC")
    private String telefoneC;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Venda> vendas = new ArrayList<>();

    public Cliente() {}

    public Cliente(String nomeC, String cpfC, String sexoC, String telefoneC) {
        if (nomeC == null || nomeC.isBlank()) throw new IllegalArgumentException("O nome do cliente é obrigatório!");
        if (cpfC == null || cpfC.isBlank()) throw new IllegalArgumentException("O CPF do cliente é obrigatório!");
        this.nomeC = nomeC;
        this.cpfC = cpfC;
        this.sexoC = sexoC;
        this.telefoneC = telefoneC;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeC() { return nomeC; }
    public void setNomeC(String nomeC) { this.nomeC = nomeC; }
    public String getCpfC() { return cpfC; }
    public void setCpfC(String cpfC) { this.cpfC = cpfC; }
    public String getSexoC() { return sexoC; }
    public void setSexoC(String sexoC) { this.sexoC = sexoC; }
    public String getTelefoneC() { return telefoneC; }
    public void setTelefoneC(String telefoneC) { this.telefoneC = telefoneC; }
    public List<Venda> getVendas() { return vendas; }
    public void setVendas(List<Venda> vendas) { this.vendas = vendas; }
}