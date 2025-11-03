  // =======================
  // 🔹 Lista de produtos
  // =======================
  const produtos = [
    { nome: "Cerveja 2M", preco: 90 },
    { nome: "Coca-Cola 1L", preco: 70 },
    { nome: "Whisky Johnnie Walker", preco: 1200 },
    { nome: "Água Mineral 500ml", preco: 40 },
    { nome: "Vinho Tinto", preco: 650 },
    { nome: "Gin Gordon’s", preco: 800 },
    { nome: "Sumo Tropical", preco: 60 },
  ];

  // =======================
  // 🔹 Alternar telas
  // =======================
  function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(t => t.classList.add('d-none'));
    document.getElementById(id).classList.remove('d-none');

    document.querySelectorAll('.menu-section .nav-link').forEach(l => l.classList.remove('active'));
    event.target.classList.add('active');
  }

  // =======================
  // 🔹 Vendas e Autocomplete
  // =======================
  const buscaInput = document.getElementById("produtoBusca");
  const listaSugestoes = document.getElementById("listaSugestoes");
  const tabelaProdutos = document.getElementById("tabelaProdutos");
  const totalVenda = document.getElementById("totalVenda");
  const btnPagar = document.getElementById("btnPagar");
  let carrinho = [];

  // Autocomplete
  buscaInput.addEventListener("input", () => {
    const texto = buscaInput.value.toLowerCase();
    listaSugestoes.innerHTML = "";

    if (!texto) return;

    // 🔎 Filtra produtos que contêm o texto digitado
    const resultados = produtos.filter(p => p.nome.toLowerCase().includes(texto));

    resultados.forEach(p => {
      const item = document.createElement("button");
      item.classList.add("list-group-item", "list-group-item-action");
      item.textContent = `${p.nome} - ${p.preco} MT`;
      item.onclick = () => {
        adicionarProduto(p);
        listaSugestoes.innerHTML = "";
        buscaInput.value = "";
      };
      listaSugestoes.appendChild(item);
    });

    // Esconde lista se não houver resultados
    if (resultados.length === 0) {
      const item = document.createElement("div");
      item.classList.add("list-group-item");
      item.textContent = "Nenhum produto encontrado";
      listaSugestoes.appendChild(item);
    }
  });

  // =======================
  // 🔹 Funções de Venda
  // =======================
  function adicionarProduto(produto) {
    const existente = carrinho.find(p => p.nome === produto.nome);
    if (existente) {
      existente.qtd += 1;
    } else {
      carrinho.push({ ...produto, qtd: 1 });
    }
    atualizarTabela();
  }

  function atualizarTabela() {
    tabelaProdutos.innerHTML = "";
    let total = 0;

    carrinho.forEach((p, index) => {
      const subtotal = p.qtd * p.preco;
      total += subtotal;

      const linha = `
        <tr>
          <td>${p.nome}</td>
          <td>${p.preco}</td>
          <td>
            <input type="number" min="1" value="${p.qtd}" class="form-control form-control-sm"
              onchange="alterarQtd(${index}, this.value)">
          </td>
          <td>${subtotal}</td>
          <td><button class="btn btn-sm btn-danger" onclick="removerProduto(${index})">Remover</button></td>
        </tr>`;
      tabelaProdutos.innerHTML += linha;
    });

    totalVenda.textContent = total;
    btnPagar.disabled = carrinho.length === 0;
  }

  function alterarQtd(index, novaQtd) {
    carrinho[index].qtd = parseInt(novaQtd);
    atualizarTabela();
  }

  function removerProduto(index) {
    carrinho.splice(index, 1);
    atualizarTabela();
  }

  // =======================
  // 🔹 Pagamento
  // =======================
  document.getElementById("confirmarPagamento").addEventListener("click", () => {
    const metodo = document.getElementById("metodoPagamento").value;
    if (!metodo) {
      alert("Por favor, selecione um método de pagamento.");
      return;
    }

    alert(`Pagamento de ${totalVenda.textContent} MT realizado com sucesso via ${metodo.toUpperCase()}!`);
    carrinho = [];
    atualizarTabela();
    document.getElementById("metodoPagamento").value = "";
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalPagamento"));
    modal.hide();
  });
