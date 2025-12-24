package com.gerenciamentogeek.api.features.categoria;

import com.gerenciamentogeek.api.features.categoria.dto.CategoriaRequest;
import com.gerenciamentogeek.api.features.categoria.dto.CategoriaResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoriaService {
    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public CategoriaResponse salvarCategoria(CategoriaRequest dados) {
        Categoria novaCategoria = new Categoria(dados.nomeCateg());
        Categoria categoriaSalva = categoriaRepository.save(novaCategoria);
        return new CategoriaResponse(categoriaSalva);
    }

    public List<CategoriaResponse> listarCategorias() {
        List<Categoria> categorias = categoriaRepository.findAll();
        return categorias.stream().map(CategoriaResponse::new).toList();
    }

    public CategoriaResponse buscarPorId(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        return new CategoriaResponse(categoria);
    }
}