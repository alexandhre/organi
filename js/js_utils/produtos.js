function indexProdutos() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarProdutos(1);
        carregarProdutosLeilao(1);
    }     
}

function carregarProdutos(currentPage) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/produtos?page=' + currentPage,
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
                $("#lista_produtos_anuncios").empty();              
                appendProdutoAnuncio('#lista_produtos_anuncios', data.response.sucesso.message.anuncios);
                appendPaginationAnuncios('#anuncio__pagination', data.response.sucesso.message.paginationAnuncio, currentPage);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function carregarProdutosLeilao(currentPage) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/produtosLeilao?page=' + currentPage,
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
                $("#lista_produtos_leilao").empty();            
                appendProdutoLeilao('#lista_produtos_leilao', data.response.sucesso.message.leiloes);
                appendPaginationLeilao('#leilao__pagination', data.response.sucesso.message.paginationLeilao, currentPage);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendProdutoAnuncio(idHtml, anuncios) {
    if (anuncios.length > 0) {
        for (var i = 0; i < anuncios.length; i++) {
            card_anuncios = '';
            card_anuncios = card_anuncios + '<div class="col-lg-4">' +
                '<div class="shoping__checkout" style="float: left;">' +
                '<a href="#" class="latest-product__item">' +
                '<div class="latest-product__item__pic">' +
                '<img src="' + anuncios[i].foto + '" alt="">' +
                '</div>' +
                '<div class="latest-product__item__text">' +
                '<h6>' + anuncios[i].DS_ANUNCIO_PRODUTO + '</h6>' +
                '<span>R$' + anuncios[i].VL_PRODUTO_UNITARIO + '</span>' +
                '</div>' +
                '</a>' +
                '<div class="footer__widget" style="margin-bottom: 0px;">' +
                '<div class="footer__widget__social" style="display: flex;justify-content: center;">' +
                '<a style="align-items: center;" href="#"><i class="fa fa-pencil"></i></a>' +
                '<a style="cursor: pointer;" onclick="showModal(' + anuncios[i].ID_ANUNCIO_PRODUTO + ')"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(idHtml).append(card_anuncios);
        }
    }
}

function appendProdutoLeilao(idHtml, leiloes) {

    if (leiloes.length > 0) {
        for (var i = 0; i < leiloes.length; i++) {
            var VL_LANCE_MAIOR = leiloes[i].VL_PRECO_INICIAL;
            var dias = ' dias';
            if (leiloes[i].VL_LANCE_MAIOR != null) {
                VL_LANCE_MAIOR = leiloes[i].VL_LANCE_MAIOR;
            } else {
                VL_LANCE_MAIOR = '0,00'
            }
            card_leiloes = '';
            card_leiloes = card_leiloes + '<div class="col-lg-4">' +
                '<div class="shoping__checkout" style="float: left;">' +
                '<a href="#" class="latest-product__item">' +
                '<div class="latest-product__item__pic">' +
                '<img src="' + leiloes[i].DS_FOTO_PRODUTO + '" alt="">' +
                '</div>' +
                '<div class="latest-product__item__text">';

            if (leiloes[i].VL_DIAS_FALTANTES == 1) {
                dias = ' dia';
            }
            if (leiloes[i].IN_LEILAO == 1) {
                card_leiloes = card_leiloes + '<h6 style="border-radius:12px;background-color:#ccfffc;font-weight: bold;width: 150px;margin: auto;display: flex;justify-content: center;margin-bottom: 10px;">' +
                    'Encerra em ' + leiloes[i].VL_DIAS_FALTANTES + dias + ' 🔥' +
                    '</h6>';
            } else if (leiloes[i].IN_LEILAO == 0) {
                card_leiloes = card_leiloes + '<h6 style="border-radius:12px;background-color:#ffcf0d;font-weight: bold;width: 150px;margin: auto;display: flex;justify-content: center;margin-bottom: 10px;">' +
                    'Leilão Encerrado 🔥' +
                    '</h6>';
            } else if (leiloes[i].IN_LEILAO == 2) {
                card_leiloes = card_leiloes + '<h6 style="border-radius:12px;background-color:#82e597;font-weight: bold;width: 150px;margin: auto;display: flex;justify-content: center;margin-bottom: 10px;">' +
                    'Leilão começa em ' + leiloes[i].VL_DIAS_FALTANTES + dias + ' 🔥' +
                    '</h6>';
            }
            card_leiloes = card_leiloes + '<h6>' + leiloes[i].DS_ANUNCIO_PRODUTO + '</h6>' +
                '<span>R$' + VL_LANCE_MAIOR + '</span>' +
                '</div>' +
                '</a>' +
                '<div class="footer__widget" style="margin-bottom: 0px;">' +
                '<div class="footer__widget__social" style="display: flex;justify-content: center;">' +
                '<a style="align-items: center;" href="#"><i class="fa fa-pencil"></i></a>' +
                '<a style="cursor: pointer;" onclick="showModal(' + leiloes[i].ID_ANUNCIO_PRODUTO + ')"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(idHtml).append(card_leiloes);
        }
    }
}

function showModal(idAnuncio) {
    sessionStorage.setItem('idAnuncio', idAnuncio);
    $('#modal-delete').modal('show');
}

function deletarProduto() {
    var myFormData = new FormData();

    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    myFormData.append('ID_COMPRADOR', ID_COMPRADOR);

    var idAnuncioProduto = 0;
    if (sessionStorage.getItem('idAnuncio')) {
        idAnuncioProduto = sessionStorage.getItem('idAnuncio')
    }
    myFormData.append('idAnuncioProduto', idAnuncioProduto);

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/deletarProduto',
        processData: false, // important
        contentType: false, // important
        data: myFormData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.response.sucesso.message.error) {
                //limpar formulario
                error('Erro ao deletar produto, entre em contato com o suporte!');
            } else {
                success(data.response.sucesso.message.message);
                //location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });

}

function appendPaginationAnuncios(idHtml, pagination, currentPage, action) {
    $(idHtml).empty();
    if (pagination.last_page < 3) {
        if (pagination.last_page == 1) {
            if (parseFloat(currentPage) == pagination.last_page) {
                currentPage = pagination.last_page;
            }
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>';
            $(idHtml).append(card_pagination);
        } else if ((parseFloat(currentPage) == 1 || parseFloat(currentPage) == 2) && pagination.last_page == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>' +
                '<a id="anuncio_page_2"style="cursor: pointer;" onclick="carregarProdutos(2)">2</a>';
            $(idHtml).append(card_pagination);
        }
    } else if (parseFloat(currentPage) >= 1) {
        if (parseFloat(currentPage) == pagination.last_page) {
            if (parseFloat(currentPage) == pagination.last_page) {
                currentPage = pagination.last_page;
            }
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(pagination.last_page) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(pagination.last_page) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 2) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 2) + ')">' + (parseFloat(currentPage) - 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 2)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 1)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 3)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 3) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 3) + ')">' + (parseFloat(currentPage) + 3) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>';
            if (currentPage > 2) {
                card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarProdutos(1)">1</a>' +
                    '<a style="cursor: pointer;">...</a>';
            }
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        }
    }

    $("#anuncio_page_" + currentPage).css('background', '#7fad39');
    $("#anuncio_page_" + currentPage).css('border-color', '#7fad39');
    $("#anuncio_page_" + currentPage).css('color', '#ffffff');
}

function appendPaginationLeilao(idHtml, pagination, currentPage, action) {
    $(idHtml).empty();
    if (pagination.last_page < 3) {
        if (pagination.last_page == 1) {
            if (parseFloat(currentPage) == pagination.last_page) {
                currentPage = pagination.last_page;
            }
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>';
            $(idHtml).append(card_pagination);
        } else if ((parseFloat(currentPage) == 1 || parseFloat(currentPage) == 2) && pagination.last_page == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>' +
                '<a id="page_2"style="cursor: pointer;" onclick="carregarProdutosLeilao(2)">2</a>';
            $(idHtml).append(card_pagination);
        }
    } else if (parseFloat(currentPage) >= 1) {
        if (parseFloat(currentPage) == pagination.last_page) {
            if (parseFloat(currentPage) == pagination.last_page) {
                currentPage = pagination.last_page;
            }
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_' + (parseFloat(pagination.last_page) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(pagination.last_page) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="page_' + (parseFloat(currentPage) - 2) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 2) + ')">' + (parseFloat(currentPage) - 2) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 2)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 1)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 3)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 3) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 3) + ')">' + (parseFloat(currentPage) + 3) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>' +
                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>';
            if (currentPage > 2) {
                card_pagination = card_pagination + '<a id="page_1"style="cursor: pointer;" onclick="carregarProdutosLeilao(1)">1</a>' +
                    '<a style="cursor: pointer;">...</a>';
            }
            card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarProdutosLeilao(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        }
    }

    $("#page_" + currentPage).css('background', '#7fad39');
    $("#page_" + currentPage).css('border-color', '#7fad39');
    $("#page_" + currentPage).css('color', '#ffffff');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Page Novo Produto

function onloadListaProdutos() {
    carregarListaProdutos();
    carregarTipoAnuncio();
    if ($('#custom-content-below-produto-tab').attr('class').search('active') != -1) {
        sessionStorage.removeItem('id_produto');
        sessionStorage.removeItem('idAnuncioNovo');
        sessionStorage.removeItem('preco');
        sessionStorage.removeItem('image');
    }
    $('#btn-produto').on('click', function () {
        $('#custom-content-below-produto-tab').removeClass('active');
        $('#custom-content-below-anuncio-tab').addClass('active');
        $('#custom-content-below-produto').removeClass('show active');
        $('#custom-content-below-anuncio').addClass('show active');
    });
    sessionStorage.setItem('qtd_images_anuncio', 0);
    sessionStorage.setItem('qtd_images_anexo', 0);
    sessionStorage.setItem('uploading_files_anuncio', JSON.stringify([]));
    sessionStorage.setItem('uploading_files_anexo', JSON.stringify([]));

    $("#imgAnuncio").change(function () {
        var qtd_images_anuncio = sessionStorage.getItem('qtd_images_anuncio');
        if (qtd_images_anuncio >= 8) {
            warning('Atingiu o numero máximo de uploads!');
        } else {
            readURL(this, 'qtd_images_anuncio', 'imagePreview', 'anuncio', 'lista_images');
        }
    });

    $("#imgAnexo").change(function() {
        var qtd_images_anexo = sessionStorage.getItem('qtd_images_anexo');
        if (qtd_images_anexo >= 4) {
            warning('Atingiu o numero máximo de uploads!');
        } else {
            readURL(this, 'qtd_images_anexo', 'imageAnexo', 'anexo', 'lista_anexos');
        }
    });
}

function carregarListaProdutos() {

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
        url: 'https://testetendering.myappnow.com.br/api/produtos',
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
                var ordenados = data.response.sucesso.message.produtos.sort((a, b) => a.DS_PRODUTO > b.DS_PRODUTO ? 1 : -1);
                appendListaProduto('#produto_novo', ordenados);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendListaProduto(idHtml, produtos) {
    if (produtos.length > 0) {
        for (var i = 0; i < produtos.length; i++) {
            card_produtos = '';
            card_produtos = card_produtos + '<option value="' + produtos[i].ID_PRODUTO + '" selected>' + produtos[i].DS_PRODUTO + '</option>';
            $(idHtml).append(card_produtos);
        }
    }
}

function carregarTipoAnuncio() {

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
        url: 'https://testetendering.myappnow.com.br/api/listaTipoAnuncio',
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
                var ordenados = data.response.sucesso.message.listaTipoAnuncio.sort((a, b) => a.DS_PRODUTO > b.DS_PRODUTO ? 1 : -1);
                appendListaAnuncio('#tipo_anuncio', ordenados);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendListaAnuncio(idHtml, listaTipoAnuncio) {
    if (listaTipoAnuncio.length > 0) {
        for (var i = 0; i < listaTipoAnuncio.length; i++) {
            card_listaTipoAnuncio = '';
            card_listaTipoAnuncio = card_listaTipoAnuncio + '<option value="' + listaTipoAnuncio[i].ID_TIPO_ANUNCIO + '" selected>' + listaTipoAnuncio[i].DS_TIPO_ANUNCIO + '</option>';
            $(idHtml).append(card_listaTipoAnuncio);
        }
    }
}

function salvarProduto() {
    sessionStorage.setItem('id_produto', $("#produto_novo").val());
    $("#custom-content-below-anuncio-tab").attr("href", "#custom-content-below-anuncio");
    $("#custom-content-below-anuncio-tab").attr("data-toggle", "pill");
    $("#produto_novo").attr("disabled", "disabled");
    $("#descricao").attr("disabled", "disabled");
    $("#btn-produto").css("display", "none");
    rolarPagina('titleAnuncio');
}

function validarEtapa(etapa) {
    if ((etapa == 2 || etapa == 3 || etapa == 4 || etapa == 5) && !sessionStorage.getItem('id_produto')) {
        warning('Escolha primeiro um produto!');
    }

    if (etapa == 3 && !sessionStorage.getItem('idAnuncioNovo')) {
        warning('Conclua o cadastro atual antes de prosseguir!');
    }

    if (etapa == 4 && (!sessionStorage.getItem('preco') || !sessionStorage.getItem('idAnuncioNovo'))) {
        warning('Conclua o cadastro atual antes de prosseguir!');
    }

    if (etapa == 5 && (!sessionStorage.getItem('preco') || !sessionStorage.getItem('idAnuncioNovo') || !sessionStorage.getItem('image'))) {
        warning('Conclua o cadastro atual antes de prosseguir!');
    }
}

function cadastrarAnuncio() {
    var id_comprador = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        id_comprador = dataUser.ID_COMPRADOR;
    }
    var idProdutoNovo = sessionStorage.getItem('id_produto');
    if ($("#tagProduto").val() == '') {
        warning('Preencha o campo de tags no formato indicado!');
        return false;
    }

    var listaTags = $("#tagProduto").val().split(";");
    if (listaTags.length > 5) {
        warning('O numero maximo de tags é 5!');
        return false;
    }

    for (var i = 0; i < listaTags.length; i++) {
        listaTags[i] = listaTags[i].trim();
        if (listaTags[i].length > 10) {
            warning('Uma tag não pode ter mais de 10 caracteres!');
            return false;
        }
    }

    if ($("#tipo_anuncio").val() == 0) {
        warning('Selecione um tipo de anuncio!');
        return false;
    }
    $('#span-anuncio').text("");
    $('#spinner').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/cadastrarAnuncio',
        dataType: "json",
        data: {
            "idComprador": id_comprador,
            "nomeProduto": $("#produto_novo option:selected").text(),
            "descricao": $("#descricao").val(),
            "idProdutoNovo": idProdutoNovo,
            "tagProduto": $("#tagProduto").val(),
            "tipo_anuncio": $("#tipo_anuncio").val(),
            "codigo": $("#codigo").val(),
            "qtd_disponivel": $("#qtd_disponivel").val(),
            "qtd_minima": $("#qtd_minima").val(),
            "capacidade_fornecimento": $("#capacidade_fornecimento").val(),
            "adulto": $("#adulto").prop("checked"),
            "infantil": $("#infantil").prop("checked"),
            "masculino": $("#masculino").prop("checked"),
            "feminino": $("#feminino").prop("checked")
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.response.sucesso.message.error) {
                //limpar formulario
                error(data.response.sucesso.message.message);
            } else {
                sessionStorage.setItem('idAnuncioNovo', data.response.sucesso.message.idAnuncioProduto);
                success(data.response.sucesso.message.message);
                $("#custom-content-below-preco-tab").attr("href", "#custom-content-below-preco");
                $("#custom-content-below-preco-tab").attr("data-toggle", "pill");
                $("#tipo_anuncio").attr("disabled", "disabled");
                $("#tagProduto").attr("disabled", "disabled");
                $("#codigo").attr("disabled", "disabled");
                $("#qtd_disponivel").attr("disabled", "disabled");
                $("#qtd_minima").attr("disabled", "disabled");
                $("#capacidade_fornecimento").attr("disabled", "disabled");
                $("#adulto").attr("disabled", "disabled");
                $("#infantil").attr("disabled", "disabled");
                $("#masculino").attr("disabled", "disabled");
                $("#feminino").attr("disabled", "disabled");
                $("#btn-anuncio").css("display", "none");

                setTimeout(() => {
                    $('#custom-content-below-anuncio-tab').removeClass('active');
                    $('#custom-content-below-preco-tab').addClass('active');
                    $('#custom-content-below-anuncio').removeClass('show active');
                    $('#custom-content-below-preco').addClass('show active');
                    rolarPagina('titlePreco');
                }, "3000");
                //location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });

}

function cadastrarDadosAdicionais() {
    var idAnuncioNovo = 0;
    if (sessionStorage.getItem('idAnuncioNovo')) {
        idAnuncioNovo = sessionStorage.getItem('idAnuncioNovo');
    }
    $('#span-preco').text("");
    $('#spinner-preco').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/cadastrarDadosAdicionais',
        dataType: "json",
        data: {
            "idAnuncioNovo": idAnuncioNovo,
            "vl_unitario": $("#vl_unitario").val(),
            "desconto": $("#desconto").val(),
            "altura_pacote": $("#altura_pacote").val(),
            "largura_pacote": $("#largura_pacote").val(),
            "comprimento_pacote": $("#comprimento_pacote").val(),
            "qtd_item_pacote": $("#qtd_item_pacote").val(),
            "peso_pacote": $("#peso_pacote").val(),
            "nome_pacote": $("#nome_pacote").val(),
            "transporte": $("#transporte").val(),
            "garantia": $("#garantia").val(),
            "promocao": $("#promocao").prop("checked")
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.response.sucesso.message.error) {
                //limpar formulario
                error(data.response.sucesso.message.message);
            } else {
                sessionStorage.setItem('preco', 1);
                success(data.response.sucesso.message.message);
                $("#custom-content-below-images-tab").attr("href", "#custom-content-below-images");
                $("#custom-content-below-images-tab").attr("data-toggle", "pill");
                $("#vl_unitario").attr("disabled", "disabled");
                $("#desconto").attr("disabled", "disabled");
                $("#altura_pacote").attr("disabled", "disabled");
                $("#largura_pacote").attr("disabled", "disabled");
                $("#comprimento_pacote").attr("disabled", "disabled");
                $("#qtd_item_pacote").attr("disabled", "disabled");
                $("#peso_pacote").attr("disabled", "disabled");
                $("#nome_pacote").attr("disabled", "disabled");
                $("#transporte").attr("disabled", "disabled");
                $("#garantia").attr("disabled", "disabled");
                $("#promocao").attr("disabled", "disabled");
                $("#btn-preco").css("display", "none");

                setTimeout(() => {
                    $('#custom-content-below-preco-tab').removeClass('active');
                    $('#custom-content-below-images-tab').addClass('active');
                    $('#custom-content-below-preco').removeClass('show active');
                    $('#custom-content-below-images').addClass('show active');
                    rolarPagina('titleImages');
                }, "3000");
                //location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });

}

function readURL(input, fieldSessionStorage, fieldImgSrc, tipoOperacao, fieldPreview) {
    salvarArquivo(input.files, tipoOperacao);
    var qtd_images = sessionStorage.getItem(fieldSessionStorage);
    if (input.files && input.files.length == 1) {
        qtd_images = incrementQtdImages(qtd_images, fieldSessionStorage);
        setPreviewImage(input.files[0], qtd_images, fieldImgSrc, fieldPreview);
    } else if (input.files.length > 1) {
        for (var i = 0; i < input.files.length; i++) {
            qtd_images = incrementQtdImages(qtd_images, fieldSessionStorage);
            setPreviewImage(input.files[i], qtd_images, fieldImgSrc, fieldPreview);
        }
    }
}

function incrementQtdImages(qtd_images, fieldSessionStorage) {
    qtd_images = parseInt(qtd_images) + 1;
    sessionStorage.setItem(fieldSessionStorage, qtd_images);
    return qtd_images;
}

function setPreviewImage(inputFile, qtd_images, fieldImgSrc, fieldPreview) {
    if(fieldPreview == 'lista_images'){
        card_produtos = '';
        card_produtos = card_produtos + '<div class="col-lg-3">' +
            '<div class="shoping__checkout" style="padding: 0px;">' +
            '<div class="latest-product__item__pic">' +
            '<img id="' + fieldImgSrc + qtd_images + '" src="#" alt="">' +
            '</div>' +
            '</div>' +
            '</div>';
            $("#"+fieldPreview).append(card_produtos);
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#' + fieldImgSrc + qtd_images).attr('src', e.target.result);
            }
            reader.readAsDataURL(inputFile);
    } else if(fieldPreview == 'lista_anexos'){
        card_produtos = '';
        card_produtos = card_produtos + '<tr>'+
        '<td class="shoping__cart__quantity">'+qtd_images+'</td>'+
        '<td class="shoping__cart__quantity">'+$("#imgAnexo").val().split("fakepath\\")[1]+'</td>'+
        '</tr>';
        $("#"+fieldPreview).append(card_produtos);            
    }
   
    
}

function salvarArquivo(inputfiles, tipoOperacao) {
    //jogar isso num metodo e utilizar o padrão fail first
    if(tipoOperacao == 'anuncio'){
        for (var i = 0; i < inputfiles.length; i++) {
            if (inputfiles[i].type.match('image/png')
                || inputfiles[i].type.match('image/jpg')
                || inputfiles[i].type.match('image/jpeg')
            ) {
                var myFormData = new FormData();
                files = Object.values(inputfiles);
                files.forEach(function (file) {
                    myFormData.append('myFiles[]', file);
                });
            } else {
                error('Tipo de arquivo não suportado, apenas imagens do tipo PNG, JPG e JPEG são aceitas!');
                return false;
            }
        }
    } else if(tipoOperacao == 'anexo'){
        for (var i = 0; i < inputfiles.length; i++) {
            if (inputfiles[i].type.match('application/pdf')
                || inputfiles[i].type.match('application/msword')
                || inputfiles[i].type.match('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            ) {
                var myFormData = new FormData();
                files = Object.values(inputfiles);
                files.forEach(function (file) {
                    myFormData.append('myFiles[]', file);
                });
            } else {
                error('Tipo de arquivo não suportado, apenas imagens do tipo PNG, JPG e JPEG são aceitas!');
                return false;
            }
        }
    }
    
    var uploadingFiles = JSON.parse(sessionStorage.getItem('uploading_files_' + tipoOperacao));
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/uploadImage',
        processData: false, // important
        contentType: false, // important
        data: myFormData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.responseFotos.erro) {
                //limpar formulario
                error('Erro ao enviar a(s) foto(s), tente novamente e caso o erro persista entre em contato com o suporte!');
            } else {
                if (data.responseFotos.fotos.length > 0) {
                    for (var i = 0; i < data.responseFotos.fotos.length; i++) {
                        uploadingFiles.push(data.responseFotos.fotos[i]);
                    }
                    sessionStorage.setItem('uploading_files_' + tipoOperacao, JSON.stringify(uploadingFiles));
                }            
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function cadastrarFotosAnuncio(){
    var idAnuncioNovo = 0;
    if (sessionStorage.getItem('idAnuncioNovo')) {
        idAnuncioNovo = sessionStorage.getItem('idAnuncioNovo');
    }
    var uploading_files_anuncio = JSON.parse(sessionStorage.getItem('uploading_files_anuncio'));
    if(uploading_files_anuncio.length == 0){
        warning('Faça de upload de fotos para o anuncio do produto!');
        return false;
    }

    var uploading_files_anexo = JSON.parse(sessionStorage.getItem('uploading_files_anexo'));
    if(uploading_files_anexo.length == 0){
        warning('Faça de upload de anexos para o produto!');
        return false;
    }
    $('#span-image').text("");
    $('#spinner-image').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/cadastrarFotosAnuncio',
        dataType: "json",
        data: {
            "idAnuncioNovo": idAnuncioNovo,
            "uploading_files_anuncio": uploading_files_anuncio ,
            "uploading_files_anexo": uploading_files_anexo            
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.response.sucesso.message.error) {
                //limpar formulario
                error(data.response.sucesso.message.message);
            } else {
                sessionStorage.setItem('image', 1);
                success(data.response.sucesso.message.message);
                $("#custom-content-below-leilao-tab").attr("href", "#custom-content-below-leilao");
                $("#custom-content-below-leilao-tab").attr("data-toggle", "pill");
                $("#imgAnuncio").attr("disabled", "disabled");
                $("#btn-image").css("display", "none");

                setTimeout(() => {
                    $('#custom-content-below-images-tab').removeClass('active');
                    $('#custom-content-below-leilao-tab').addClass('active');
                    $('#custom-content-below-images').removeClass('show active');
                    $('#custom-content-below-leilao').addClass('show active');
                    rolarPagina('titleLeilao');
                }, "3000");

                //location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function rolarPagina(idElemento) {
    var elementoDesejado = $('#' + idElemento);
    $('html, body').animate({
        scrollTop: elementoDesejado.offset().top
    }, 1000);
}

function validarTags(nome) {
    return !!nome.match(/[a-z][a-z]*;[a-z]][a-z]*/);
}

function alterarTextoButton() {
    if($("#btn-leilao").text() == 'Cadastrar'){
        $("#btn-leilao").text('Continuar');
        $("#btn-leilao").attr('onclick', 'goToMeusProdutos()'); 
        $("#loja").attr("disabled", "disabled");
        $("#vendedor").attr("disabled", "disabled");
        $("#dt_inicio").attr("disabled", "disabled");
        $("#dt_fim").attr("disabled", "disabled");
        $("#identificacao").attr("disabled", "disabled");
        $("#informacoes").attr("disabled", "disabled");
        $("#condicoesGerais").attr("disabled", "disabled");
        $("#acessorios").attr("disabled", "disabled");
    } else {
        $("#loja").prop("disabled", false);
        $("#vendedor").prop("disabled", false);
        $("#dt_inicio").prop("disabled", false);
        $("#dt_fim").prop("disabled", false);
        $("#identificacao").prop("disabled", false);
        $("#informacoes").prop("disabled", false);
        $("#condicoesGerais").prop("disabled", false);
        $("#acessorios").prop("disabled", false);
        $("#btn-leilao").text('Cadastrar');
        $("#btn-leilao").attr('onclick', 'cadastrarDadosLeilao()');
    }
}

function goToMeusProdutos(){
    window.location.href = "meusprodutos.html";
}

function cadastrarDadosLeilao() {
    var idAnuncioNovo = 0;
    if (sessionStorage.getItem('idAnuncioNovo')) {
        idAnuncioNovo = sessionStorage.getItem('idAnuncioNovo');
    }
    var id_comprador = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        id_comprador = dataUser.ID_COMPRADOR;
    }
    if($("#loja").val() == ''){
        $('#loja').focus();
        warning('Preencha o campo de loja!');
        return false;
    }

    if($("#vendedor").val() == ''){
        $('#vendedor').focus();
        warning('Preencha o campo de vendedor!');
        return false;
    }

    if($("#identificacao").val() == ''){
        $('#identificacao').focus();
        warning('Preencha o campo de identificação!');
        return false;
    }

    if($("#informacoes").val() == ''){
        $('#informacoes').focus();
        warning('Preencha o campo de informações!');
        return false;
    }

    if($("#condicoesGerais").val() == ''){
        $('#condicoesGerais').focus();
        warning('Preencha o campo de condições gerais!');
        return false;
    }

    if($("#acessorios").val() == ''){
        $('#acessorios').focus();
        warning('Preencha o campo de acessórios!');
        return false;
    }

    if($("#dt_inicio").val() == ''){
        $('#dt_inicio').focus();
        warning('Preencha o campo de data de inicio!');
        return false;
    }
   
    if($("#dt_fim").val() == ''){
        $('#dt_fim').focus();
        warning('Preencha o campo de data fim!');
        return false;
    }
    $('#span-leilao').text("");
    $('#spinner-leilao').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/cadastrarDadosLeilao',
        dataType: "json",
        data: {
            "idAnuncioNovo": idAnuncioNovo,
            "id_comprador": id_comprador,
            "loja": $("#loja").val(),   
            "vendedor": $("#vendedor").val(),   
            "identificacao": $("#identificacao").val(),   
            "informacoes": $("#informacoes").val(),    
            "condicoesGerais": $("#condicoesGerais").val(),    
            "acessorios": $("#acessorios").val(),         
            "dt_inicio": $("#dt_inicio").val(),  
            "dt_fim": $("#dt_fim").val()
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.response.sucesso.message.error) {
                //limpar formulario
                error(data.response.sucesso.message.message);
            } else {
                success(data.response.sucesso.message.message);               
                setTimeout(() => {
                    window.location.href = "meusprodutos.html";
                }, "3000");
                //location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });

}


