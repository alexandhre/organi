function indexProdutos() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarAnunciosProdutos(1);
    }     
}

function carregarAnunciosProdutos(currentPage) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    var myFormData = new FormData();
    myFormData.append('idComprador', ID_COMPRADOR);
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/listaProdutos?page='+currentPage,
        dataType: "json",
        processData: false, // important
        contentType: false, 
        data: myFormData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT                 
                appendProdutoAnuncio('#lista_produtos_anuncios', data.response.sucesso.message.produtos, 'inicio');
                appendPagination('#pagination', data.response.sucesso.message.pagination, currentPage);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function filtrarElementos(produtos) {
    for (let i = 0; i < produtos.length; i++) {//Go through the items but only show items that have size from show_sizes_array
        if (produtos[i]['VL_PPRODUTO_UNITARIO'] <= max_price && category_items[i]['VL_PPRODUTO_UNITARIO'] >= min_price) {
            let item_content = '<div class="col-12 col-md-4 text-center product-card" data-available-sizes="' + category_items[i]['sizes'] + '"><b>' + category_items[i]['title'] + '</b><br><img src="' + category_items[i]['thumbnail'] + '" height="64" width="64" alt="shoe thumbnail"><p>$' + category_items[i]['price'] + '</p></div>';
            $("#display-items-div").append(item_content);//Display in grid
        }
    }
}

function appendProdutoAnuncio(idHtml, produtos, operacao = '') {
    $(idHtml).empty();
    var qtd_heart = 0;
    var qtd_cart = 0;
    let array = [];

    if (operacao == 'pesquisa') {
        var precoMin = $("#minamount").val().trim().split("$")[1];
        var precoMax = $("#maxamount").val().trim().split("$")[1];

        let valorMinimo = parseInt(precoMin);
        let valorMaximo = parseInt(precoMax);

        valorMinimo = parseFloat(valorMinimo);
        valorMaximo = parseFloat(valorMaximo);

        for (let i = 0; i < produtos.length; i++) {
            const valor = produtos[i].VL_PRODUTO_UNITARIO;
            if (valor >= valorMinimo && valor <= valorMaximo) {
                array.push(produtos[i]);
            }
        }
        produtos = array;
    }

    if (produtos.length > 0) {
        for (var i = 0; i < produtos.length; i++) {
            card_produtos = '';
            card_produtos = card_produtos + '<div class="col-lg-4 col-md-6 col-sm-6">' +
                '<div class="product__item">' +
                '<div class="product__item__pic set-bg" data-setbg="' + produtos[i].DS_FOTO_ANUNCIO_PRODUTO + '" style="background-image: url(' + produtos[i].DS_FOTO_ANUNCIO_PRODUTO + ');">' +
                '<ul class="product__item__pic__hover">' +
                '<li id="li-heart-' + produtos[i].ID_ANUNCIO_PRODUTO + '"><a onclick="favoritarAnuncio(' + produtos[i].ID_ANUNCIO_PRODUTO + ')" id="a-heart-' + produtos[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-heart-' + produtos[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-heart"></i></a></li>' +
                '<li id="li-cart-' + produtos[i].ID_ANUNCIO_PRODUTO + '"><a onclick="addCarrinho(' + produtos[i].ID_ANUNCIO_PRODUTO + ')" id="a-cart-' + produtos[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-cart-' + produtos[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-shopping-cart"></i></a></li>' +
                '<li id="li-plus-' + produtos[i].ID_ANUNCIO_PRODUTO + '"><a onclick="abrirDetalheAnuncio(' + produtos[i].ID_ANUNCIO_PRODUTO + ')" id="a-cart-' + produtos[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-cart-' + produtos[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-plus"></i></a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="product__item__text">' +
                '<h6><a href="#">' + produtos[i].DS_PRODUTO + '</a></h6>' +
                '<h5>R$' + produtos[i].VL_PRODUTO_UNITARIO + '</h5>' +
                '</div>' +
                '</div>' +
                '</div></a>';
            $(idHtml).append(card_produtos);
            if (produtos[i].FLAG_FAVORITO == 1) {
                qtd_heart++;
                $("#a-heart-" + produtos[i].ID_ANUNCIO_PRODUTO).css('background', '#7fad39');
                $("#a-heart-" + produtos[i].ID_ANUNCIO_PRODUTO).css('border-color', '#7fad39');
                $("#i-heart-" + produtos[i].ID_ANUNCIO_PRODUTO).css('color', 'white');
            }
            if (produtos[i].FLAG_CARRINHO == 1) {
                qtd_cart++;
                $("#a-cart-" + produtos[i].ID_ANUNCIO_PRODUTO).css('background', '#7fad39');
                $("#a-cart-" + produtos[i].ID_ANUNCIO_PRODUTO).css('border-color', '#7fad39');
                $("#i-cart-" + produtos[i].ID_ANUNCIO_PRODUTO).css('color', 'white');
            }
        }
    } else {
        sessionStorage.setItem('numeroElementos', 0);
        warning('Não há mais registros de produtos!');
        $('#recarregar-pagina').css('display', 'block');
        $('#btn-mais-produto').css('display', 'none');
    }

    if (operacao != 'pesquisa') {
        $("#heart-number").text(qtd_heart);
        $("#cart-number").text(qtd_cart);

        $("#heart-number-mobile").text(qtd_heart);
        $("#cart-number-mobile").text(qtd_cart);
    }

    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });
    $('.featured__controls li').on('click', function () {
        $('.featured__controls li').removeClass('active');
        $(this).addClass('active');
    });
    if ($('.featured__filter').length > 0) {
        var containerEl = document.querySelector('.featured__filter');
        var mixer = mixitup(containerEl);
    }
}

function abrirDetalheAnuncio(idAnuncioProduto) {
    localStorage.setItem('idAnuncioProduto', idAnuncioProduto);
    window.location.href = "shop-details.html";
}

function favoritarAnuncio(idAnuncioProduto) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    var myFormData = new FormData();
    myFormData.append('idAnuncioProduto', idAnuncioProduto);
    myFormData.append('idComprador', ID_COMPRADOR);
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/favoritarAnuncio',
        dataType: "json",
        processData: false, // important
        contentType: false, // important
        data: myFormData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT  
                let numberHeartUpdate = $("#heart-number").text();
                if (data.response.sucesso.message.returnFavorito == 1) {
                    $("#a-heart-" + idAnuncioProduto).css('background', '#7fad39');
                    $("#a-heart-" + idAnuncioProduto).css('border-color', '#7fad39');
                    $("#i-heart-" + idAnuncioProduto).css('color', 'white');
                    numberHeartUpdate = parseFloat(numberHeartUpdate) + 1;
                } else if (data.response.sucesso.message.returnFavorito == 0) {
                    $("#a-heart-" + idAnuncioProduto).css('background', 'white');
                    $("#a-heart-" + idAnuncioProduto).css('border-color', 'white');
                    $("#i-heart-" + idAnuncioProduto).css('color', 'black');
                    numberHeartUpdate = parseFloat(numberHeartUpdate) - 1;
                }
                $("#heart-number").text(numberHeartUpdate);
                success(data.response.sucesso.message.message);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function addCarrinho(idAnuncioProduto) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    var myFormData = new FormData();
    myFormData.append('idAnuncioProduto', idAnuncioProduto);
    myFormData.append('idComprador', ID_COMPRADOR);
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/addCarrinho',
        dataType: "json",
        processData: false, // important
        contentType: false, // important
        data: myFormData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT  
                let numberCartUpdate = $("#cart-number").text();
                if (data.response.sucesso.message.returnCarrinho == 1) {
                    $("#a-cart-" + idAnuncioProduto).css('background', '#7fad39');
                    $("#a-cart-" + idAnuncioProduto).css('border-color', '#7fad39');
                    $("#i-cart-" + idAnuncioProduto).css('color', 'white');
                    numberCartUpdate = parseFloat(numberCartUpdate) + 1;
                    $("#cart-number").text(numberCartUpdate);
                success(data.response.sucesso.message.message);
                } else if (data.response.sucesso.message.returnCarrinho == 0) {
                    $("#a-cart-" + idAnuncioProduto).css('background', 'white');
                    $("#a-cart-" + idAnuncioProduto).css('border-color', 'white');
                    $("#i-cart-" + idAnuncioProduto).css('color', 'black');
                    numberCartUpdate = parseFloat(numberCartUpdate) - 1;
                    $("#cart-number").text(numberCartUpdate);
                    success(data.response.sucesso.message.message);
                } else if (data.response.sucesso.message.returnCarrinho == 2) {                 
                    error(data.response.sucesso.message.message);
                }
                
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function pesquisarProdutos() {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }

    var categoriasId = JSON.parse(sessionStorage.getItem('categoriasId'));

    var precoMin = $("#minamount").val().trim().split("$")[1];
    var precoMax = $("#maxamount").val().trim().split("$")[1];

    var myFormData = new FormData();
    myFormData.append('categoriasId', categoriasId);
    myFormData.append('idComprador', ID_COMPRADOR);
    myFormData.append('precoMin', precoMin);
    myFormData.append('precoMax', precoMax);

    $('#span-produto').text("");
    $('#spinner-produto').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/pesquisar',
        processData: false, // important
        contentType: false, // important
        data: myFormData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.response.sucesso.message.error) {
                //limpar formulario
                error(data.response.sucesso.message.message);
            } else {
                $('#span-produto').text("Pesquisar");
                $('#spinner-produto').css('display', 'none');
                $("#lista_produtos_anuncios").empty();
                appendProdutoAnuncio('#lista_produtos_anuncios', data.response.sucesso.message.produtos, 'pesquisa');
                appendPagination('#pagination', data.response.sucesso.message.pagination, 1);
                //location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}