function indexCheckout() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        recuperarNumeroCarrinhoFavorito();
    }   
}

function recuperarNumeroCarrinhoFavorito() {
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
        url: 'https://testetendering.myappnow.com.br/api/checkout',
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
                appendListaProdutosCheckout('#carrinho', data.response.sucesso.message.carrinho);
                appendCidade('#id_cidade', data.response.sucesso.message.cidades);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendCidade(idHtml, cidades) {

    if (cidades.length > 0) {
        for (var i = 0; i < cidades.length; i++) {
            card_cidade = '';
            card_cidade = card_cidade + '<option value="' + cidades[i].ID_CIDADE + '">' + cidades[i].DS_CIDADE + '</option>';
            $(idHtml).append(card_cidade);
            $('.list').append(card_cidade);
            $('.list').css('width', '100%');
            $('.list').css('overflow-x', 'hidden');
            $('.list').css('overflow-y', 'scroll');
            $('.list').css('height', '200px');
            $('.list').css('white-space', 'nowrap');
        }
    }
}

function appendListaProdutosCheckout(idHtml, carrinho) {
    let totalCheckout = 0;
    if (carrinho.length > 0) {
        for (var i = 0; i < carrinho.length; i++) {
            carrinho[i].QTD_PEDIDO = 1;
            card_carrinho = '';
            card_carrinho = card_carrinho + '<li>' + carrinho[i].DS_ANUNCIO_PRODUTO + ' <span>R$' + carrinho[i].VL_PRODUTO_UNITARIO + '</span></li>';
            $(idHtml).append(card_carrinho);
            totalCheckout = totalCheckout + parseFloat(carrinho[i].VL_PRODUTO_UNITARIO);
        }
        $("#subtotal").text(parseFloat(totalCheckout).toFixed(2));
        $("#total").text(parseFloat(totalCheckout).toFixed(2));
    }
}

function validarCupom() {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    var myFormData = new FormData();
    myFormData.append('idComprador', ID_COMPRADOR);
    if ($("#cupom_input").val() == '') {
        warning("Insira o código do cupom!");
        return false;
    }
    myFormData.append('cupom', $("#cupom_input").val());
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/validarCupom',
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
                if(data.response.sucesso.message.validade){
                    success(data.response.sucesso.message.message);
                    appendValueCupom(data.response.sucesso.message.cupom);
                } else {
                    error(data.response.sucesso.message.message);
                }       
                
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendValueCupom(cupom) {
    card_cupom = '';
    card_cupom = card_cupom + '<li>'+cupom[0].DS_CODIGO+'<span>R$'+cupom[0].VL_CUPOM+'</span></li>';
    $("#cupom").append(card_cupom);
    let total = $("#total").text();
   
    total = parseFloat(total) + parseFloat(cupom[0].VL_CUPOM);

    $("#total").text(parseFloat(total).toFixed(2));

    setTimeout(() => {
        $('#modal-default').modal('hide'); 
        $('#cupom_input').val('');
    }, 3000)
}
