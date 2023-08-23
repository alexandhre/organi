function onloadCategoria(tela = '') {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarCategorias(tela);
    }   
    sessionStorage.setItem('categoriasId', JSON.stringify([]));
}

function carregarCategorias(tela = '') {

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
        url: 'https://testetendering.myappnow.com.br/api/categoria',
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
                var categoriasOrdenadas = data.response.sucesso.message.categorias.sort((a, b) => a.DS_CATEGORIA_PRODUTO > b.DS_CATEGORIA_PRODUTO ? 1 : -1);
                if(tela == 'produtosGrid'){
                    appendCategoriasPrateleira('#menuLateralCategoria', categoriasOrdenadas);
                } else {
                    appendCategoriaMenuLateral('#menuLateralCategoria', categoriasOrdenadas);                
                }               
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}

function appendCategoriaMenuLateral(idHtml, categorias) {
    if (categorias.length > 0) {
        for (var i = 0; i < categorias.length; i++) {
            card_categoria = '';
            card_categoria = card_categoria + '<li><a href="#"><i style="font-size: 10px;font-weight: 100;" class="fa fa-arrow-right" aria-hidden="true"></i> ' + categorias[i].DS_CATEGORIA_PRODUTO + '</a></li><div class="filter__item" style="padding-top: 0px;padding-bottom: 0px;"><div class="row"></div></div>';
            $(idHtml).append(card_categoria);           
        }              
    }
}

function appendCategoriasPrateleira(idHtml, categorias) {
    if (categorias.length > 0) {
        for (var i = 0; i < categorias.length; i++) {
            card_categoria = '';
            card_categoria = card_categoria + '<div class="checkout__input__checkbox">'+
            '<label for="categoria-' + categorias[i].ID_CATEGORIA_PRODUTO + '">' + categorias[i].DS_CATEGORIA_PRODUTO + '<input onclick="guardarCategoria(' + categorias[i].ID_CATEGORIA_PRODUTO + ')" type="checkbox" id="categoria-' + categorias[i].ID_CATEGORIA_PRODUTO + '">'+
            '<span class="checkmark"></span></label></div><div class="filter__item" style="padding-top: 0px;padding-bottom: 0px;"><div class="row"></div></div>';            
            $(idHtml).append(card_categoria);           
        }              
    }
}

function guardarCategoria(ID_CATEGORIA_PRODUTO) {
    var categoriasId = JSON.parse(sessionStorage.getItem('categoriasId'));
    
    if(categoriasId.indexOf(ID_CATEGORIA_PRODUTO) == -1) {
        categoriasId.push(ID_CATEGORIA_PRODUTO);
    } else {
        var categoriasId = categoriasId.filter(function(e) { return e !== ID_CATEGORIA_PRODUTO })
    }    
    sessionStorage.setItem('categoriasId', JSON.stringify(categoriasId));
}
