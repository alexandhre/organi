function indexCarrinho() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarCarrinho();
    }   
    sessionStorage.setItem('anunciosId', JSON.stringify([]));
}

function carregarCarrinho() {
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
        url: 'https://testetendering.myappnow.com.br/api/carrinho',
        dataType: "json",
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
                //posteriormente implementar JWT                 
                appendTableCarrinho('#lista_carrinho', data.response.sucesso.message.carrinho);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendTableCarrinho(idHtml, carrinho) {
    let totalCheckout = 0;
    if (carrinho.length > 0) {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        for (var i = 0; i < carrinho.length; i++) {
            
            carrinho[i].QTD_PEDIDO = 1;
            card_carrinho = '';
            card_carrinho = card_carrinho + '<tr id="carrinho_' + carrinho[i].ID_ANUNCIO_PRODUTO + '" >' +
                '<td><div class="checkout__input__checkbox">' +
                '<label for="checkout_' + carrinho[i].ID_ANUNCIO_PRODUTO + '">' +                
                '<input onclick="guardarCheckout(' + carrinho[i].ID_ANUNCIO_PRODUTO + ')" type="checkbox" id="checkout_' + carrinho[i].ID_ANUNCIO_PRODUTO + '">' +
                '<span class="checkmark"></span>' +
                '</label>' +
                '</div></td>'+
                '<td class="shoping__cart__item">' +
                '<img style="width: 100px;height: 100px;" src="' + carrinho[i].DS_FOTO_ANUNCIO_PRODUTO + '" alt="">' +
                '<h5>' + carrinho[i].DS_ANUNCIO_PRODUTO + '</h5>' +
                '</td>' +
                '<td class="shoping__cart__price">R$' + carrinho[i].VL_PRODUTO_UNITARIO + '</td>' +
                '<td class="shoping__cart__quantity">' +
                '<div class="col-sm-6" style="margin-left: 55px;">' +
                '<div class="form-group">' +
                '<select class="form-control" onchange="atualizarValorItens(this, ' + carrinho[i].VL_PRODUTO_UNITARIO + ', ' + carrinho[i].ID_ANUNCIO_PRODUTO + ');">' +
                '<option>1</option>' +
                '<option>2</option>' +
                '<option>3</option>' +
                '<option>4</option>' +
                '<option>5</option>' +
                '<option>6</option>' +
                '<option>7</option>' +
                '<option>8</option>' +
                '<option>9</option>' +
                '<option>10</option>' +
                '<option>15</option>' +
                '<option>20</option>' +
                '</select>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td id="totalCarrinho_' + carrinho[i].ID_ANUNCIO_PRODUTO + '" class="shoping__cart__total">R$' + carrinho[i].VL_PRODUTO_UNITARIO + '</td>' +
                '<td class="shoping__cart__item__close">' +
                '<span onclick="removeCarrinho(' + carrinho[i].ID_ANUNCIO_PRODUTO + ')" class="icon_close"></span>' +
                '</td>' +
                '</tr>';
            $(idHtml).append(card_carrinho);
            totalCheckout = totalCheckout + parseFloat(carrinho[i].VL_PRODUTO_UNITARIO);
        }
        $("#subtotal").text(parseFloat(totalCheckout).toFixed(2));
        $("#total").text(parseFloat(totalCheckout).toFixed(2));
    }
}

function guardarCheckout(ID_ANUNCIO_PRODUTO) {
    var anunciosId = JSON.parse(sessionStorage.getItem('anunciosId'));
    
    if(anunciosId.indexOf(ID_ANUNCIO_PRODUTO) == -1) {
        anunciosId.push(ID_ANUNCIO_PRODUTO);
    } else {
        var anunciosId = anunciosId.filter(function(e) { return e !== ID_ANUNCIO_PRODUTO })
    }    
    sessionStorage.setItem('anunciosId', JSON.stringify(anunciosId));
}

function salvarCheckout() {
    var myFormData = new FormData();
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    myFormData.append('idComprador', ID_COMPRADOR);

    var anunciosId = [];
    if (sessionStorage.getItem('anunciosId')) {
        anunciosId = JSON.parse(sessionStorage.getItem('anunciosId'));
    }
    myFormData.append('anunciosId', anunciosId);

    if(anunciosId.length == 0){
        warning('Por favor, selecione ao menos um produto!');
        return false;
    }

    if(anunciosId.length > 20){
        warning('Ultrapassou limite máximo de produtos por pedido!');
        return false;
    }
   
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/salvarCheckout',
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
                success(data.response.sucesso.message.message);

                setTimeout(() => {
                    window.location.href = "checkout.html";
                }, "3000");
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}


function removeCarrinho(idAnuncioProduto) {
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
                numberCartUpdate = parseFloat(numberCartUpdate) - 1;
                $("#cart-number").text(numberCartUpdate);
                $("#carrinho_" + idAnuncioProduto).remove();
                success(data.response.sucesso.message.message);
                atualizarListaStorage(idAnuncioProduto);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function atualizarValorItens (option, VL_PRODUTO_UNITARIO, idAnuncioProduto){
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));
    let valorAtualizado = parseFloat(VL_PRODUTO_UNITARIO) * option.value;
    let totalValorAtualizar = 0;
    for (var i = 0; i < carrinho.length; i++) {
        if(carrinho[i].ID_ANUNCIO_PRODUTO == idAnuncioProduto){
            carrinho[i].VL_PRODUTO_UNITARIO = valorAtualizado;
            carrinho[i].QTD_PEDIDO = option.value;
        }
        totalValorAtualizar = parseFloat(totalValorAtualizar) + parseFloat(carrinho[i].VL_PRODUTO_UNITARIO);
    }       
    $("#totalCarrinho_"+idAnuncioProduto).text('R$'+ parseFloat(valorAtualizado).toFixed(2));
    atualizarValorCheckout(totalValorAtualizar);
    
}

function atualizarListaStorage (idAnuncioProduto){
    let totalValorAtualizar = 0;
    var carrinho = JSON.parse(localStorage.getItem('carrinho'));
    carrinho = carrinho.filter(elemento => elemento.ID_ANUNCIO_PRODUTO != idAnuncioProduto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    for (var i = 0; i < carrinho.length; i++) {       
        totalValorAtualizar = parseFloat(totalValorAtualizar) + parseFloat(carrinho[i].VL_PRODUTO_UNITARIO);
    }
    atualizarValorCheckout(totalValorAtualizar);
}

function atualizarValorCheckout (totalValorAtualizar){
    $("#subtotal").text(parseFloat(totalValorAtualizar).toFixed(2));
    $("#total").text(parseFloat(totalValorAtualizar).toFixed(2));
}
