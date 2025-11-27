import axios from 'https://cdn.skypack.dev/axios';

const api = axios.create({
    baseURL: 'url aqui',
    headers: {
        'Content-Type': 'application/json'
    }
});

export async function cadastrarCliente(cliente) {
    try {
        const response = await api.post('/clientes', {
            nome: cliente.nome,
            cpf: cliente.cpf,
            sexo: cliente.sexo,
            telefone: cliente.telefone
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function cadastrarProduto(produto) {
    try {
        const response = await api.post('/produtos', {
            nome: produto.nome,
            preco: parseFloat(produto.preco),
            codigo: produto.codigo,
            estoque: parseInt(produto.estoque),
            categoria: produto.categoria,
            descricao: produto.descricao
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function cadastrarVenda(venda) {
    try {
        const response = await api.post('/vendas', {
            cpf_cliente: venda.cpf,
            data_venda: venda.data || new Date().toISOString(),
            itens: venda.itens.map(item => ({
                codigo: item.codigo,
                quantidade: parseInt(item.qtd),
                preco_unitario: parseFloat(item.preco)
            })),
            total: parseFloat(venda.total)
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function listarProdutos() {
    try {
        const response = await api.get('/produtos');
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}