function redirecionarPesquisa(pagina) {
    sessionStorage.setItem('pagina', pagina);
    window.location.href = '/pesquisa';
}

function onload() {
    carregarCategorias();
    carregarPromocoes();
    carregarProdutos();
    localStorage.removeItem('idAnuncioProduto');
    localStorage.removeItem('id_produto');
    localStorage.removeItem('carrinho');
    sessionStorage.removeItem('qtd_images_anexo');
    sessionStorage.removeItem('uploading_files_anuncio');
    sessionStorage.removeItem('categoriasId');
    sessionStorage.removeItem('compras');
    sessionStorage.removeItem('qtd_images_anuncio');
    sessionStorage.removeItem('uploading_files_anexo');

}

function carregarCategorias() {

    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/categoria',
        dataType: "json",
        data: { 'idComprador': ID_COMPRADOR },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT 
                var categoriasOrdenadas = data.response.sucesso.message.categorias.sort((a, b) => a.DS_CATEGORIA_PRODUTO > b.DS_CATEGORIA_PRODUTO ? 1 : -1);
                appendCategoriaMenuLateral('#menuLateralCategoria', categoriasOrdenadas);
                appendCategoriaCarousel('#carouselCategoria', categoriasOrdenadas);
                appendCategoriaProdutosDestaque('#produtosDestaqueCategoria', categoriasOrdenadas);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendCategoriaMenuLateral(idHtml, categorias) {
    if (categorias.length > 0) {
        for (var i = 0; i < 8; i++) {
            card_categoria = '';
            card_categoria = card_categoria + '<li><a href="#"><i style="font-size: 10px;font-weight: 100;" class="fa fa-arrow-right" aria-hidden="true"></i> ' + categorias[i].DS_CATEGORIA_PRODUTO + '</a></li><div class="filter__item" style="padding-top: 0px;padding-bottom: 0px;"><div class="row"></div></div>';
            $(idHtml).append(card_categoria);
        }
        card_categoria = card_categoria + '<li><a href="shop-grid.html"><i style="font-size: 10px;font-weight: 100;" class="fa fa-arrow-right" aria-hidden="true"></i> Ver mais categorias</a></li><div class="filter__item" style="padding-top: 0px;padding-bottom: 0px;"><div class="row"></div></div>';
        $(idHtml).append(card_categoria);
    }
}

function appendCategoriaCarousel(idHtml, categorias) {

    if (categorias.length > 0) {
        for (var i = 0; i < categorias.length; i++) {
            if (categorias[i].DS_CATEGORIA_PRODUTO.length <= 35) {
                var urlImg = "img/categories/cat-" + (i + 1) + ".jpg"
                card_categoria = '';
                card_categoria = card_categoria + '<div class="col-lg-3">' +
                    '<div class="categories__item set-bg" data-setbg="img/categories/cat-' + (i + 1) + '.jpg" style="background-image: url(' + urlImg + ');">' +
                    '<h5><a href="#">' + categorias[i].DS_CATEGORIA_PRODUTO + '</a></h5>' +
                    '</div>' +
                    '</div>';
                $(idHtml).append(card_categoria);
            }
        }
    }

    /*-----------------------
        Categories Slider
    ------------------------*/
    $(".categories__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

            0: {
                items: 1,
            },

            480: {
                items: 2,
            },

            768: {
                items: 3,
            },

            992: {
                items: 4,
            }
        }
    });
}

function appendCategoriaProdutosDestaque(idHtml, categorias) {

    if (categorias.length > 0) {
        for (var i = 0; i < categorias.length; i++) {
            if (categorias[i].IN_HOME == "1") {
                card_categoria = '';
                card_categoria = card_categoria + '<li data-filter=".' + categorias[i].DS_FEATURED_CONTROL + '">' + categorias[i].DS_CATEGORIA_PRODUTO + '</li>';
                $(idHtml).append(card_categoria);
            }
        }
    }
}

function carregarPromocoes() {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/promocao',
        dataType: "json",
        data: { 'idComprador': ID_COMPRADOR },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT 
                appendPromocao('#listPromocao', data.response.sucesso.message.promocoes);
                appendRecentes('#listRecentes', data.response.sucesso.message.recentes);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendPromocao(idHtml, promocao) {
    if (promocao.length > 0) {
        var sizePromocao = 0;
        if (promocao.length > 9) {
            sizePromocao = 9;
        } else {
            sizePromocao = promocao.length;
        }
        for (var i = 0; i < sizePromocao; i++) {
            var fotoProduto = '';
            if(promocao[i].DS_FOTO_ANUNCIO_PRODUTO.length == 0){
                fotoProduto = "img/latest-product/lp-1.jpg";
            } else {
                fotoProduto = promocao[i].DS_FOTO_ANUNCIO_PRODUTO;
            }
            card_promocao = '';
            card_promocao = card_promocao + ' <a href="#" class="latest-product__item">' +
                '<div class="latest-product__item__pic">' +
                '<img style="width: 110px; height: 110px;" src="' + fotoProduto + '" alt="">' +
                '</div>' +
                '<div class="latest-product__item__text">' +
                '<h6>' + promocao[i].DS_PRODUTO + '</h6>' +
                '<span>R$ ' + promocao[i].VL_PRODUTO_UNITARIO + '</span>' +
                '</div>' +
                '</a>';
            if (i <= 2) {
                $(idHtml + '1').append(card_promocao);
            } else if (i > 2 && i <= 5) {
                $(idHtml + '2').append(card_promocao);
            } else if (i > 5 && i <= 8) {
                $(idHtml + '3').append(card_promocao);
            }
        }
    }
    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    $(".latest-product__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });
}

function appendRecentes(idHtml, recente) {
    if (recente.length > 0) {
        var sizeRecente = 0;
        if (recente.length > 9) {
            sizeRecente = 9;
        } else {
            sizeRecente = recente.length;
        }       
        for (var i = 0; i < sizeRecente; i++) {
            var fotoProduto = '';
            if(recente[i].FOTO_ANUNCIO.length == 0){
                fotoProduto = "img/latest-product/lp-1.jpg";
            } else {
                fotoProduto = recente[i].FOTO_ANUNCIO;
            }
            card_recente = '';
            card_recente = card_recente + ' <a id="produto_' + recente[i].ID_PRODUTO + '" href="#" class="latest-product__item">' +
                '<div class="latest-product__item__pic">' +
                '<img style="width: 110px; height: 110px;" src="' + fotoProduto + '" alt="">' +
                '</div>' +
                '<div class="latest-product__item__text">' +
                '<h6>' + recente[i].DS_PRODUTO + '</h6>' +
                '<span>R$ ' + recente[i].VL_PRODUTO_UNITARIO + '</span>' +
                '</div>' +
                '</a>';
            if (i <= 2) {
                $(idHtml + '1').append(card_recente);
            } else if (i > 2 && i <= 5) {
                $(idHtml + '2').append(card_recente);
            } else if (i > 5) {
                $(idHtml + '3').append(card_recente);
            }
        }

    }

    /*--------------------------
        Latest Product Slider
    ----------------------------*/
    $(".recente-product__slider").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
    });
}

function carregarProdutos() {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/produtosIndex',
        dataType: "json",
        data: { 
                'idComprador': ID_COMPRADOR,
                'precoMin': 0,
                'precoMax': 99999999
              },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.response.error) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT 
                appendProduto('#listProduto', data.response.sucesso.message.produtos.produtos);
                let numberHeart = data.response.sucesso.message.produtos.produtos.filter(elemento => elemento.FLAG_FAVORITO == 1);
                $("#heart-number").text(numberHeart.length);
                localStorage.setItem('heart-number', numberHeart.length);
                let numberCart = data.response.sucesso.message.produtos.produtos.filter(elemento => elemento.FLAG_CARRINHO == 1);
                $("#cart-number").text(numberCart.length);
                localStorage.setItem('cart-number', numberCart.length);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendProduto(idHtml, produto) {

    if (produto.length > 0) {
        for (var i = 0; i < produto.length; i++) {
            var fotoProduto = '';
            if(produto[i].DS_FOTO_ANUNCIO_PRODUTO.length == 0){
                fotoProduto = "img/latest-product/lp-1.jpg";
            } else {
                fotoProduto = produto[i].DS_FOTO_ANUNCIO_PRODUTO;
            }
            card_produto = '';
            card_produto = card_produto + '<div class="col-lg-3 col-md-4 col-sm-6 mix ' + produto[i].DS_FEATURED_CONTROL + '">' +
                '<div class="featured__item">' +
                '<div class="featured__item__pic set-bg" data-setbg="'+fotoProduto+'" style="background-image: url('+fotoProduto+');height: 270px;width: 263px;">' +
                '<ul class="featured__item__pic__hover">' +
                '<li id="li-heart-' + produto[i].ID_ANUNCIO_PRODUTO + '"><a onclick="favoritarAnuncio(' + produto[i].ID_ANUNCIO_PRODUTO + ')" id="a-heart-' + produto[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-heart-' + produto[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-heart"></i></a></li>' +
                '<li id="li-cart-' + produto[i].ID_ANUNCIO_PRODUTO + '"><a onclick="addCarrinho(' + produto[i].ID_ANUNCIO_PRODUTO + ')" id="a-cart-' + produto[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-cart-' + produto[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-shopping-cart"></i></a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="featured__item__text">' +
                '<h6><a href="#">' + produto[i].DS_PRODUTO + '</a></h6>' +
                '<h5>R$' + produto[i].VL_PRODUTO_UNITARIO + '</h5>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(idHtml).append(card_produto);
            if (produto[i].FLAG_FAVORITO == 1) {
                $("#a-heart-" + produto[i].ID_ANUNCIO_PRODUTO).css('background', '#7fad39');
                $("#a-heart-" + produto[i].ID_ANUNCIO_PRODUTO).css('border-color', '#7fad39');
                $("#i-heart-" + produto[i].ID_ANUNCIO_PRODUTO).css('color', 'white');
            }
            if (produto[i].FLAG_CARRINHO == 1) {
                $("#a-cart-" + produto[i].ID_ANUNCIO_PRODUTO).css('background', '#7fad39');
                $("#a-cart-" + produto[i].ID_ANUNCIO_PRODUTO).css('border-color', '#7fad39');
                $("#i-cart-" + produto[i].ID_ANUNCIO_PRODUTO).css('color', 'white');
            }
        }
    } else {
        sessionStorage.setItem('numeroElementos', 0);
        warning('Não há mais registros de produtos!');
        $('#recarregar-pagina').css('display', 'block');
        $('#btn-mais-produto').css('display', 'none');
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

function armazenarLista(tipoLista, listaProduto) {
    sessionStorage.setItem(tipoLista, JSON.stringify(listaProduto));
}

function preencherComboCategoria(categorias) {

    if (categorias.length > 0) {
        card_categoria = '';
        card_categoria = card_categoria + '<option id="-1">Selecione</option>';
        for (var i = 0; i < categorias.length; i++) {
            card_categoria = card_categoria + '<option value=' + categorias[i].ID_CATEGORIA_PRODUTO + '>' + categorias[i].DS_CATEGORIA_PRODUTO + '</option>';
        }
    } else {
        card_categoria = card_categoria + '<option id="0">Sem registros!</option>';
    }
    $('#categoria1').append(card_categoria);
    $('#categoria2').append(card_categoria);
    $('#categoria3').append(card_categoria);
}

function pesquisar() {

    var ID_CATEGORIA_1 = $('#categoria1').val();
    var ID_CATEGORIA_2 = $('#categoria2').val();
    var ID_CATEGORIA_3 = $('#categoria3').val();

    if (validarCategoriaPesquisa(ID_CATEGORIA_1, ID_CATEGORIA_2, ID_CATEGORIA_3)) {
        warning('Selecione ao menos uma categoria!');
        return false;
    }

    var VL_PRECO = $('#price-max').val();

    //mandar um array
    //colocar categoria na session storage

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: '/pesquisar',
        dataType: "json",
        data: {
            "ID_CATEGORIA_1": ID_CATEGORIA_1,
            "ID_CATEGORIA_2": ID_CATEGORIA_2,
            "ID_CATEGORIA_3": ID_CATEGORIA_3,
            "VL_PRECO": VL_PRECO
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT 
                //colocar categorias no cache
                var pagina = sessionStorage.getItem('pagina');
                if (pagina == 'promocao') {
                    $('#listPromocao').empty();
                    $('#btn-mais-promocao').css('display', 'none');
                    appendPromocao('#listPromocao', data.response.sucesso.message.produtos);
                } else if (pagina == 'produto') {
                    $('#listProduto').empty();
                    $('#btn-mais-produto').css('display', 'none');                    
                    appendProduto('#listProduto', data.response.sucesso.message.produtos);
                }
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}

function validarCategoriaPesquisa(categoria1, categoria2, categoria3) {

    if (categoria1 == "Selecione" && categoria2 == "Selecione" && categoria3 == "Selecione") {
        return true
    }
    return false;
}

//colocar nos utils
function recarregarPagina() {
    location.reload();
}

function ordenarProdutos(tipoOrdenacao) {
    switch (tipoOrdenacao) {
        case 'barato':
            var listaProduto = JSON.parse(sessionStorage.getItem('lista'));
            listaProduto = listaProduto.sort((a, b) => (a.VL_PRODUTO_UNITARIO > b.VL_PRODUTO_UNITARIO ? 1 : -1))
            //chamar append
            break;
        case 'caro':
            break;
        case 'vendido':
            break;
        case 'AZ':
            break;
        case 'ZA':
            break;
        default:
    }
}

function pesquisarIndex() {
    if (window.location.pathname == '/home') {
        window.location.href = '/pesquisa';
        return false;
    }

    var DS_INPUT_PESQUISA = $('#inputPesquisa').val();

    if (DS_INPUT_PESQUISA == '') {
        warning('Campo de pesquisa vazio!');
        return false;
    }

    var pagina = sessionStorage.getItem('pagina');
    switch (pagina) {
        case 'categoria':
            pesquisarCategorias(DS_INPUT_PESQUISA);
            break;
        case 'promocao':
            pesquisarProdutos(DS_INPUT_PESQUISA);
            break;
        case 'produto':
            pesquisarProdutos(DS_INPUT_PESQUISA);
            break;
        default:
    }
}

function pesquisarCategorias(DS_INPUT_PESQUISA) {

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: '/pesquisarCategoria',
        dataType: "json",
        data: {
            "DS_INPUT_PESQUISA": DS_INPUT_PESQUISA
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                $('#listCategoria').empty();
                $('#btn-mais-categoria').css('display', 'none');
                appendCategoria('#listCategoria', data.response.sucesso.message.categorias);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}

function pesquisarProdutos(DS_INPUT_PESQUISA) {

    //implementar logica de só retornar valor para promoção se for promoção mesmo
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: '/pesquisarProdutoInput',
        dataType: "json",
        data: {
            "DS_INPUT_PESQUISA": DS_INPUT_PESQUISA
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT 
                //colocar categorias no cache
                var pagina = sessionStorage.getItem('pagina');
                if (pagina == 'promocao') {
                    $('#listPromocao').empty();
                    $('#btn-mais-promocao').css('display', 'none');
                    appendPromocao('#listPromocao', data.response.sucesso.message.produtos);
                } else if (pagina == 'produto') {
                    $('#listProduto').empty();
                    $('#btn-mais-produto').css('display', 'none');
                    appendProduto('#listProduto', data.response.sucesso.message.produtos);
                }
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
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
                localStorage.setItem('heart-number', numberHeartUpdate);
                success(data.response.sucesso.message.message);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.erro.message);
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
                } else if (data.response.sucesso.message.returnCarrinho == 0) {
                    $("#a-cart-" + idAnuncioProduto).css('background', 'white');
                    $("#a-cart-" + idAnuncioProduto).css('border-color', 'white');
                    $("#i-cart-" + idAnuncioProduto).css('color', 'black');
                    numberCartUpdate = parseFloat(numberCartUpdate) - 1;
                }
                $("#cart-number").text(numberCartUpdate);
                localStorage.setItem('cart-number', numberCartUpdate);
                success(data.response.sucesso.message.message);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}



