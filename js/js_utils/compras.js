function indexCompras() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarCompras(1);
    }
}

function carregarCompras(currentPage) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/compras?page=' + currentPage,
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
                $("#lista_compras").empty();
                appendCompras('#lista_compras', data.response.sucesso.message.compras);
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

function appendCompras(idHtml, compras) {

    if (compras.length > 0) {
        for (var i = 0; i < compras.length; i++) {
            card_compras = '';
            card_compras = card_compras + '<tr>' +
                '<td class="shoping__cart__quantity">' +
                '<h5>' + compras[i].DT_PEDIDO + '</h5>' +
                '</td>' +
                '<td class="shoping__cart__quantity">' +
                '<h5>' + compras[i].ID_PEDIDO + '</h5>' +
                '</td>' +
                '<td class="shoping__cart__quantity">' +
                '<h5>' + compras[i].DT_ENTREGA + '</h5>' +
                '</td>' +
                '<td class="shoping__cart__total">R$' + compras[i].VL_TOTAL_PEDIDO + '</td>' +
                '<td class="shoping__cart__item__close">' +
                '<span class="icon_plus" data-toggle="modal" data-target="#modal-default" onclick="montarModalItens(' + compras[i].ID_PEDIDO + ')"></span>' +
                '</td>' +
                '</tr>';
            $(idHtml).append(card_compras);
        }
        armazenarLista('compras', compras);
    }
}

function armazenarLista(label, lista) {
    sessionStorage.setItem(label, JSON.stringify(lista));
}

function montarModalItens(id_pedido) {
    $('#modalItens').empty();
    if (sessionStorage.getItem('compras')) {
        var compras = JSON.parse(sessionStorage.getItem('compras'));
        var itens = compras.filter(elemento => elemento.ID_PEDIDO == id_pedido);
        var listIdAnuncio = [];
        if (itens[0]['ITENS_PEDIDO'].length > 0) {
            for (var i = 0; i < itens[0]['ITENS_PEDIDO'].length; i++) {
                listIdAnuncio.push(itens[0]['ITENS_PEDIDO'][i].ID_ANUNCIO_PRODUTO);                
                card_item = '';
                card_item = card_item + '<tr>' +
                    '<td class="shoping__cart__quantity">' +
                    '<img src="https://testetendering.myappnow.com.br/images/anuncios/' + itens[0]['ITENS_PEDIDO'][i].ID_ANUNCIO_PRODUTO + '/' + itens[0]['ITENS_PEDIDO'][i].foto[0].DS_FOTO_PRODUTO + '" alt="">' +
                    '</td>' +
                    '<td class="shoping__cart__quantity">' +
                    '<h5>' + itens[0]['ITENS_PEDIDO'][i].DS_PRODUTO + '</h5>' +
                    '</td>' +
                    '<td class="shoping__cart__quantity">' +
                    '<div class="quantity">' +
                    '<div class="pro-qty">' +
                    '<input type="text" value="' + itens[0]['ITENS_PEDIDO'][i].QT_PRODUTO + '">' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td class="shoping__cart__total">' + itens[0]['ITENS_PEDIDO'][i].VL_ITEM + '</td>' +
                    '<td class="shoping__cart__total">' + itens[0]['ITENS_PEDIDO'][i].VL_ENVIO + '</td>' +
                    '</tr>';
                $('#modalItens').append(card_item);
            }
            sessionStorage.setItem('listIdAnuncio', JSON.stringify(listIdAnuncio));
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
            card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>';
            $(idHtml).append(card_pagination);
        } else if ((parseFloat(currentPage) == 1 || parseFloat(currentPage) == 2) && pagination.last_page == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>' +
                '<a id="anuncio_page_2"style="cursor: pointer;" onclick="carregarCompras(2)">2</a>';
            $(idHtml).append(card_pagination);
        }
    } else if (parseFloat(currentPage) >= 1) {
        if (parseFloat(currentPage) == pagination.last_page) {
            if (parseFloat(currentPage) == pagination.last_page) {
                currentPage = pagination.last_page;
            }
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(pagination.last_page) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(pagination.last_page) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 2) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 2) + ')">' + (parseFloat(currentPage) - 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarCompras(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 2)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarCompras(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 1)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarCompras(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 3)) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarCompras(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 3) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 3) + ')">' + (parseFloat(currentPage) + 3) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else if (parseFloat(currentPage) == 2) {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarCompras(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarCompras(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        } else {
            card_pagination = '';
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>';
            if (currentPage > 2) {
                card_pagination = card_pagination + '<a id="anuncio_page_1"style="cursor: pointer;" onclick="carregarCompras(1)">1</a>' +
                    '<a style="cursor: pointer;">...</a>';
            }
            card_pagination = card_pagination + '<a id="anuncio_page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarCompras(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                '<a style="cursor: pointer;">...</a>' +
                '<a id="anuncio_page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarCompras(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                '<a id="anuncio_page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarCompras(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
            $(idHtml).append(card_pagination);
        }
    }

    $("#anuncio_page_" + currentPage).css('background', '#7fad39');
    $("#anuncio_page_" + currentPage).css('border-color', '#7fad39');
    $("#anuncio_page_" + currentPage).css('color', '#ffffff');
}

function addCarrinho() {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    var listIdAnuncio = JSON.parse(sessionStorage.getItem('listIdAnuncio'));
    var confirmAddCarrinho = 0;
    if(listIdAnuncio.length > 0){
        for (var i = 0; i < listIdAnuncio.length; i++) {
            var myFormData = new FormData();
            myFormData.append('idAnuncioProduto', listIdAnuncio[i]);
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
                            numberCartUpdate = parseFloat(numberCartUpdate) + 1;
                        } else if (data.response.sucesso.message.returnCarrinho == 0) {
                            numberCartUpdate = parseFloat(numberCartUpdate) - 1;
                        }
                        $("#cart-number").text(numberCartUpdate);
                        localStorage.setItem('cart-number', numberCartUpdate);    
                        confirmAddCarrinho++;                 
                    }
        
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.erro.message);
                }
            });
        } 
        setTimeout(() => {
            if(confirmAddCarrinho == 2){
                window.location.href = 'shoping-cart.html';
            }
        }, 3000);
        
             
    }    
}



