package com.gerenciamentogeek.api.features.venda;

import com.gerenciamentogeek.api.features.cliente.Cliente;
import com.gerenciamentogeek.api.features.cliente.ClienteRepository;
import com.gerenciamentogeek.api.features.funcionario.Funcionario;
import com.gerenciamentogeek.api.features.funcionario.FuncionarioRepository;
import com.gerenciamentogeek.api.features.produto.Produto;
import com.gerenciamentogeek.api.features.produto.ProdutoRepository;
import com.gerenciamentogeek.api.features.venda.dto.VendaRequest;
import com.gerenciamentogeek.api.features.venda.dto.VendaResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class VendaService {
    private final VendaRepository repository;
    private final ProdutoRepository produtoRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final ClienteRepository clienteRepository;

    public VendaService(VendaRepository repository, ProdutoRepository produtoRepository, FuncionarioRepository funcionarioRepository, ClienteRepository clienteRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public VendaResponse cadastrarVenda(VendaRequest dados) {
        Cliente c = clienteRepository.buscarPorCpf(dados.cpfCliente()).orElseThrow();
        Funcionario f = funcionarioRepository.findById(dados.idFuncionario()).orElseThrow();
        FormaPagamento p = new FormaPagamento(dados.formaPagamento(), dados.parcelasPagamento());
        Venda v = new Venda(dados.data(), dados.total(), dados.qtd(), c, f, p);
        p.setVenda(v);
        List<Produto> prods = new ArrayList<>();
        dados.itemVenda().forEach(item -> {
            Produto prod = produtoRepository.findById(item.idProduto()).orElseThrow();
            if (prod.getQtdEstoque() < item.qtdProduto()) throw new RuntimeException("Estoque insuficiente");
            prod.setQtdEstoque(prod.getQtdEstoque() - item.qtdProduto());
            produtoRepository.save(prod);
            prods.add(prod);
        });
        v.setProd(prods);
        return new VendaResponse(repository.save(v));
    }

    public List<VendaResponse> listarVendas(String cpfC) {
        List<Venda> vs = (cpfC == null) ? repository.findAll() : repository.listarVendaPorCPFCliente(cpfC);
        return vs.stream().map(VendaResponse::new).toList();
    }
}