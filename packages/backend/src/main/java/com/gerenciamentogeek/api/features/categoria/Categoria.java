package com.gerenciamentogeek.api.features.categoria;

import jakarta.persistence.*;

@Entity
@Table(name="tbCategoria")
public class Categoria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nomeCateg")
    private String nomeCateg;

    public Categoria() {}

    public Categoria(String nomeCateg) {
        this.nomeCateg = nomeCateg;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNomeCateg() { return nomeCateg; }
    public void setNomeCateg(String nomeCateg) { this.nomeCateg = nomeCateg; }
}