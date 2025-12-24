package com.gerenciamentogeek.api.features.funcionario;

import com.gerenciamentogeek.api.features.cargo.Cargo;
import com.gerenciamentogeek.api.features.login.Login;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name="tbFuncionario")
public class Funcionario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeF;
    private String cpfF;
    private String logradouro;
    private String cep;
    private String numero;
    private String complemento;
    private String telefoneF;

    @OneToOne(mappedBy = "funcionario", cascade=CascadeType.ALL)
    private Login login;

    @ManyToOne
    @JoinColumn(name = "cargo_id")
    private Cargo cargo;

    public Funcionario() {}

    public Funcionario(String nome, String cpf, String logradouro, String cep, String numero, String complemento, String telefone, Login login, Cargo cargo) {
        this.nomeF = nome;
        this.cpfF = cpf;
        this.logradouro = logradouro;
        this.cep = cep;
        this.numero = numero;
        this.complemento = complemento;
        this.telefoneF = telefone;
        this.login = login;
        this.cargo = cargo;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = "ROLE_" + this.cargo.getFuncao().toUpperCase().replace(" ", "_");
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override public String getPassword() { return login.getSenha(); }
    @Override public String getUsername() { return login.getLogin(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }

    public Long getId() { return id; }
    public String getNomeF() { return nomeF; }
    public String getCpfF() { return cpfF; }
    public String getLogradouro() { return logradouro; }
    public String getCep() { return cep; }
    public String getNumero() { return numero; }
    public String getComplemento() { return complemento; }
    public String getTelefoneF() { return telefoneF; }
    public Login getLogin() { return login; }
    public Cargo getCargo() { return cargo; }
    public void setNomeF(String n) { this.nomeF = n; }
    public void setCpfF(String c) { this.cpfF = c; }
    public void setLogradouro(String l) { this.logradouro = l; }
    public void setCep(String c) { this.cep = c; }
    public void setNumero(String n) { this.numero = n; }
    public void setComplemento(String c) { this.complemento = c; }
    public void setTelefoneF(String t) { this.telefoneF = t; }
    public void setCargo(Cargo c) { this.cargo = c; }
}