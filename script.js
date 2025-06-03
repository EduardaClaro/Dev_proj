$(document).ready(function() {
    const apiUrl = 'https://fakestoreapi.com/products';
    const $catalogo = $('#catalogo');
    const $loading = $('#loading');
    const $error = $('#error');
    const $totalProdutos = $('#total-produtos');
    const $sortButton = $('#sort-price');
    const $sortIcon = $('.sort-icon');
    let products = []; // Armazena os produtos para busca
    let isAscending = true; // Controla a direção da ordenação

    // Função para exibir produtos
    function displayProducts(produtos) {
        $catalogo.empty();
        if (!produtos.length) {
            $catalogo.html('<div class="col-12"><p class="text-warning">Nenhum produto encontrado.</p></div>');
            return;
        }
        $.each(produtos, function(index, product) {
            const productCard = `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card product-card h-100">
                        <img src="${product.image}" class="card-img-top product-image p-3" alt="${product.title}" style="height: 200px; object-fit: contain;">
                        <div class="card-body">
                            <h5 class="card-title product-title">${product.title}</h5>
                            <p class="card-text product-price">R$${product.price.toFixed(2)}</p>
                            <p class="card-text">${product.category}</p>
                            <a href="#" class="btn btn-primary btn-sm">Ver Detalhes</a>
                        </div>
                    </div>
                </div>`;
            $catalogo.append(productCard);
        });
    }

    // Atualiza o total de produtos
    function updateTotalProducts(total) {
        $totalProdutos.text(total);
    }

    // Mostrar spinner de carregamento
    $loading.removeClass('d-none');

    $.getJSON(apiUrl)
        .done(function(data) {
            $loading.addClass('d-none'); // Esconder spinner
            if (data.length === 0) {
                $error.text('Nenhum produto encontrado.').removeClass('d-none');
                return;
            }
            products = data; // Salva os produtos para busca
            updateTotalProducts(products.length);
            displayProducts(products);
        })
        .fail(function() {
            $loading.addClass('d-none'); // Esconder spinner
            $error.removeClass('d-none'); // Mostrar erro
        });

    // Função de busca com debounce
    function performSearch() {
        const searchTerm = $('#search').val().toLowerCase().trim();
        if (!products.length) {
            $catalogo.html('<div class="col-12"><p class="text-warning">Aguarde, carregando produtos...</p></div>');
            $('img[alt="Banner do catálogo de produtos"]').hide();
            return;
        }
        let filteredProducts = products.filter(product =>
            product.title && product.title.toLowerCase().includes(searchTerm)
        );
        // Aplicar ordenação aos produtos filtrados
        filteredProducts = filteredProducts.sort((a, b) =>
            isAscending ? a.price - b.price : b.price - a.price
        );
        displayProducts(filteredProducts);
        updateTotalProducts(filteredProducts.length);
        $('img[alt="Banner do catálogo de produtos"]').toggle(!searchTerm);
    }

    // Evento de input com debounce
    let searchTimeout;
    $('#search').on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300); // Debounce de 300ms
    });

    // Evento de submissão do formulário
    $('form[role="search"]').on('submit', function(e) {
        e.preventDefault(); // Impede o envio do formulário
        performSearch();
    });

    // Evento de ordenação por preço
    $sortButton.on('click', function() {
        isAscending = !isAscending; // Alternar direção
        $sortIcon.text(isAscending ? '↑' : '↓'); // Atualizar ícone
        performSearch(); // Reaplicar busca com nova ordenação
    });
});