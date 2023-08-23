function indexLeiloes() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarLeiloes(1);
    }    
}

function carregarLeiloes(currentPage) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/leiloes?page=' + currentPage,
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
                $("#lista_leiloes").empty();                
                appendLeiloes('#lista_leiloes', data.response.sucesso.message.leiloes);
                appendPagination('#pagination', data.response.sucesso.message.paginationLeilao, currentPage);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendLeiloes(idHtml, leiloes) {

    if (leiloes.length > 0) {
        for (var i = 0; i < leiloes.length; i++) {
            var VL_LANCE_MAIOR = "0,00";
            var dias = ' dias';
            if (leiloes[i].VL_LANCE_MAIOR != null) {
                VL_LANCE_MAIOR = leiloes[i].VL_LANCE_MAIOR;
            }

            card_leiloes = '';
            card_leiloes = card_leiloes + '<div class="col-lg-4 col-md-6 col-sm-6">' +
                '<div class="product__item">' +
                '<div class="product__item__pic set-bg" data-setbg="' + leiloes[i].DS_FOTO_PRODUTO + '" style="background-image: url(' + leiloes[i].DS_FOTO_PRODUTO + ');">' +
                '</div>' +
                '<div class="product__item__text">';
                if(leiloes[i].VL_DIAS_FALTANTES == 1){
                    dias = ' dia';
                }
            if (leiloes[i].IN_LEILAO == 1) {
                card_leiloes = card_leiloes + '<h6 style="border-radius:12px;background-color:#ccfffc;font-weight: bold;width: 250px;margin: auto;display: flex;justify-content: center;margin-bottom: 10px;">' +
                    'Encerra em ' + leiloes[i].VL_DIAS_FALTANTES + dias + ' 🔥' +
                    '</h6>';
            } else if (leiloes[i].IN_LEILAO == 0) {
                card_leiloes = card_leiloes + '<h6 style="border-radius:12px;background-color:#ffcf0d;font-weight: bold;width: 250px;margin: auto;display: flex;justify-content: center;margin-bottom: 10px;">' +
                    'Leilão Encerrado 🔥' +
                    '</h6>';
            } else if (leiloes[i].IN_LEILAO == 2) {
                card_leiloes = card_leiloes + '<h6 style="border-radius:12px;background-color:#82e597;font-weight: bold;width: 250px;margin: auto;display: flex;justify-content: center;margin-bottom: 10px;">' +
                    'Leilão começa em ' + leiloes[i].VL_DIAS_FALTANTES + dias + ' 🔥' +
                    '</h6>';
            }
            card_leiloes = card_leiloes + '<h6><a href="#">' + leiloes[i].DS_ANUNCIO_PRODUTO + '</a></h6>' +
                '<h5>R$' + VL_LANCE_MAIOR + '</h5>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(idHtml).append(card_leiloes);
        }
    }
}

function appendPagination(idHtml, pagination, currentPage, action) {
    $(idHtml).empty();
    if (pagination.last_page < 3) {
        if (pagination.last_page == 1) {
            if (parseFloat(currentPage) == pagination.last_page) {
                currentPage = pagination.last_page;
            }
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>';
            $(idHtml).append(card_pagination);
        } else if ((parseFloat(currentPage) == 1 || parseFloat(currentPage) == 2) && pagination.last_page == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>' +
                '<a id="anuncio_page_2"style="cursor: pointer;" onclick="carregarLeiloes(2)">2</a>';
            $(idHtml).append(card_pagination);
        }
    } else if (parseFloat(currentPage) >= 1) {
        if (parseFloat(currentPage) == pagination.last_page) {
            if (parseFloat(currentPage) == pagination.last_page) {
                currentPage = pagination.last_page;
            }
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(pagination.last_page) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(pagination.last_page) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 2) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 2) + ')">' + (parseFloat(currentPage) - 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 2)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 1)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 3)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 3) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 3) + ')">' + (parseFloat(currentPage) + 3) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>';
            if (currentPage > 2) {
                card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarLeiloes(1)">1</a>' +
                    '<a style="cursor: pointer;">...</a>';
            }
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarLeiloes(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        }
    }

    $("#anuncio_page_" + currentPage).css('background', '#7fad39');
    $("#anuncio_page_" + currentPage).css('border-color', '#7fad39');
    $("#anuncio_page_" + currentPage).css('color', '#ffffff');
}


