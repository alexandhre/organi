function indexDetalheProduto() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarProduto();
    }     
}

function carregarProduto() {
    var ID_ANUNCIO_PRODUTO = 0;
    if (localStorage.getItem('idAnuncioProduto')) {
        ID_ANUNCIO_PRODUTO = localStorage.getItem('idAnuncioProduto');
    }
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    var myFormData = new FormData();
    myFormData.append('idAnuncioProduto', ID_ANUNCIO_PRODUTO);
    myFormData.append('idComprador', ID_COMPRADOR);
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/recuperarDetalheAnuncio',
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
                appendFotoAnuncio(data.response.sucesso.message.fotos);
                appendDetalheProduto(data.response.sucesso.message.anuncio);
                appendSemelhantesAnuncios('#anuncios_semelhates', data.response.sucesso.message.anuncios);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendFotoAnuncio(fotos) {
    if (fotos.length > 0) {
        $("#imagem_principal").attr("src", fotos[0].DS_FOTO_ANUNCIO_PRODUTO); 
        if(fotos.length > 2){
            for (var i = 0; i < fotos.length; i++) {                       
                $("#bigimg"+(i+1)).data('imgbigurl', fotos[i].DS_FOTO_ANUNCIO_PRODUTO);
                $("#img"+(i+1)).attr("src", fotos[i].DS_FOTO_ANUNCIO_PRODUTO);      
                $("#bigimg"+(i+1)).css("display", 'block');                  
            }
        }                       
    } else {

    }
}

function appendDetalheProduto(anuncio) {
    if (anuncio.length > 0) {
        $('#heart_btn').attr('onclick', 'favoritarAnuncio('+anuncio[0].ID_ANUNCIO_PRODUTO+',0)');
        if(anuncio[0].FLAG_FAVORITO == 1){
            $("#heart_btn").css('background', '#7fad39');
            $("#heart_icon").removeClass('icon_heart_alt');
            $("#heart_icon").addClass('icon_heart');
            $("#heart_icon").css('color', 'black');            
        }

        if(anuncio[0].FLAG_CARRINHO == 1){
            $('#cart_btn').text('Adicionado ao carrinho');
        } else {
            $('#cart_btn').attr('onclick', 'addCarrinho('+anuncio[0].ID_ANUNCIO_PRODUTO+',0)'); 
        }

        $("#nome_produto").text(anuncio[0].DS_ANUNCIO_PRODUTO);
        $("#vl_produto").text(anuncio[0].VL_PRODUTO_UNITARIO);
        if (anuncio[0].VL_PRODUTO_ANTIGO != null) {
            $("#vl_produto_antigo").text('R$' + anuncio[0].VL_PRODUTO_ANTIGO);
            $("#label_produto_antigo").css('display', 'block');
            $("#vl_produto_antigo").css('display', 'block');
        }
        $("#desc_produto").text(anuncio[0].DS_DETALHE_PRODUTO);
        if (parseFloat(anuncio[0].QT_DISPONIVEL) > 0) {
            $("#estoque").text('Em estoque');
        }
        $("#peso_produto").text(anuncio[0].VL_PESO_PACOTE_KG + ' kg');
        if (anuncio[0].DS_DESCRICAO != null) {
            $("#desc_produto2").text(anuncio[0].DS_DESCRICAO);
        } else {
            $("#desc_produto2").text('Nenhuma descrição inserida!');
        }

        var card_anuncio = '';
        card_anuncio = card_anuncio + '<tr>' +
            '<td class="shoping__cart__quantity">' + anuncio[0].QT_DISPONIVEL + '</td>' +
            '<td class="shoping__cart__quantity">' + anuncio[0].QT_MINIMA_PEDIDO + '</td>' +
            '<td class="shoping__cart__quantity">' + anuncio[0].VL_ALTURA_PACOTE + ' cm</td>' +
            '<td class="shoping__cart__quantity">' + anuncio[0].VL_LARGURA_PACOTE + ' cm</td>' +
            '<td class="shoping__cart__quantity">' + anuncio[0].VL_COMPRIMENTO_PACOTE + ' cm</td>' +
            '<td class="shoping__cart__quantity">' + anuncio[0].QT_ITEM_PACOTE + '</td></tr>';
        $("#info_produto").append(card_anuncio);

    } else {
        warning('Erro ao recuperar detalhe do produto, entre em contato com o suporte!');
    }
}

function appendSemelhantesAnuncios(idHtml, anuncios) {
    if (anuncios.length > 0) {
        for (var i = 0; i < anuncios.length; i++) {
            card_anuncios = '';
            card_anuncios = card_anuncios + '<div class="col-lg-3 col-md-4 col-sm-6">' +
                '<div class="product__item">' +
                '<div class="product__item__pic set-bg" data-setbg="' + anuncios[i].DS_FOTO_ANUNCIO_PRODUTO + '" style="background-image: url(' + anuncios[i].DS_FOTO_ANUNCIO_PRODUTO + ');">' +
                '<ul class="product__item__pic__hover">' +
                '<li id="li-heart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '"><a onclick="favoritarAnuncio(' + anuncios[i].ID_ANUNCIO_PRODUTO + ',1)" id="a-heart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-heart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-heart"></i></a></li>' +
                '<li id="li-cart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '"><a onclick="addCarrinho(' + anuncios[i].ID_ANUNCIO_PRODUTO + ',1)" id="a-cart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-cart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-shopping-cart"></i></a></li>' +
                '<li id="li-plus-' + anuncios[i].ID_ANUNCIO_PRODUTO + '"><a onclick="abrirDetalheAnuncio(' + anuncios[i].ID_ANUNCIO_PRODUTO + ')" id="a-cart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '" style="cursor: pointer;"><i id="i-cart-' + anuncios[i].ID_ANUNCIO_PRODUTO + '" class="fa fa-plus"></i></a></li>' +
                '</ul>' +
                '</div>' +
                '<div class="product__item__text">' +
                '<h6><a href="#">' + anuncios[i].DS_PRODUTO + '</a></h6>' +
                '<h5>R$' + anuncios[i].VL_PRODUTO_UNITARIO + '</h5>' +
                '</div>' +
                '</div>' +
                '</div></a>';
            $(idHtml).append(card_anuncios);
            if (anuncios[i].FLAG_FAVORITO == 1) {
                $("#a-heart-" + anuncios[i].ID_ANUNCIO_PRODUTO).css('background', '#7fad39');
                $("#a-heart-" + anuncios[i].ID_ANUNCIO_PRODUTO).css('border-color', '#7fad39');
                $("#i-heart-" + anuncios[i].ID_ANUNCIO_PRODUTO).css('color', 'white');
            }
            if (anuncios[i].FLAG_CARRINHO == 1) {
                $("#a-cart-" + anuncios[i].ID_ANUNCIO_PRODUTO).css('background', '#7fad39');
                $("#a-cart-" + anuncios[i].ID_ANUNCIO_PRODUTO).css('border-color', '#7fad39');
                $("#i-cart-" + anuncios[i].ID_ANUNCIO_PRODUTO).css('color', 'white');
            }
        }
    }    
}

function favoritarAnuncio(idAnuncioProduto, origem) {
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
                    if(origem == 0){
                        $("#heart_btn").css('background', '#7fad39');
                        $("#heart_icon").removeClass('icon_heart_alt');
                        $("#heart_icon").addClass('icon_heart');
                        $("#heart_icon").css('color', 'black'); 
                    } else if(origem == 1) {
                        $("#a-heart-" + idAnuncioProduto).css('background', '#7fad39');
                        $("#a-heart-" + idAnuncioProduto).css('border-color', '#7fad39');
                        $("#i-heart-" + idAnuncioProduto).css('color', 'white');
                    }                                       
                    numberHeartUpdate = parseFloat(numberHeartUpdate) + 1;
                } else if (data.response.sucesso.message.returnFavorito == 0) {
                    if(origem == 0){
                        $("#heart_btn").css('background', '#f5f5f5');
                        $("#heart_icon").removeClass('icon_heart');
                        $("#heart_icon").addClass('icon_heart_alt');
                        $("#heart_icon").css('color', '#6f6f6f'); 
                    } else if(origem == 1) {
                        $("#a-heart-" + idAnuncioProduto).css('background', 'white');
                        $("#a-heart-" + idAnuncioProduto).css('border-color', 'white');
                        $("#i-heart-" + idAnuncioProduto).css('color', 'black');
                    }                      
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

function addCarrinho(idAnuncioProduto, origem) {
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
                if(origem == 0){
                    $('#cart_btn').text('Adicionado ao carrinho');
                    numberCartUpdate = parseFloat(numberCartUpdate) + 1;
                    $('#cart_btn').attr('onclick', null);
                } else if(origem == 1) {                    
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
                }   
                $("#cart-number").text(numberCartUpdate);
                
                success(data.response.sucesso.message.message);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function abrirDetalheAnuncio(idAnuncioProduto) {
    localStorage.setItem('idAnuncioProduto', idAnuncioProduto);
    window.location.href = "shop-details.html";
}