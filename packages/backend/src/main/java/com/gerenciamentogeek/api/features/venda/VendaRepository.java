package com.gerenciamentogeek.api.features.venda;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {
    @Query("SELECT v FROM Venda v WHERE v.cliente.cpfC = :cpfC")
    List<Venda> listarVendaPorCPFCliente(String cpfC);
}