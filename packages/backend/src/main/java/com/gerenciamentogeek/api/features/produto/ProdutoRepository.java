package com.gerenciamentogeek.api.features.produto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    @Query("SELECT p FROM Produto p WHERE p.codigoProd = :codigoProd")
    Optional<Produto> findByCodigoProd(int codigoProd);
}