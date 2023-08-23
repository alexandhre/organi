function indexContato() {
    recuperarCarrinhoFavorito();
}

function recuperarCarrinhoFavorito() {
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
        url: 'https://testetendering.myappnow.com.br/api/contatoIndex',
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
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}


function enviarMensagem() {

    if ($("#nome").val() === '') {
        alert('É necessário informar o nome!');
        $("#nome").focus();
        return false;
    }

    DS_NOME = $("#nome").val();

    if ($("#email").val() === '') {
        alert('É necessário informar o email!');
        $("#email").focus();
        return false;
    }
    DS_EMAIL = $("#email").val();

    if ($("#mensagem").val() === '') {
        alert('É necessário informar a mensagem!');
        $("#mensagem").focus();
        return false;
    }

    DS_MENSAGEM = $("#mensagem").val();
    var myFormData = new FormData();
    myFormData.append('DS_MENSAGEM', DS_MENSAGEM);
    myFormData.append('DS_NOME', DS_NOME);
    myFormData.append('DS_EMAIL', DS_EMAIL);
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/enviarMensagem',
        dataType: "json",
        processData: false, // important
        contentType: false, // important
        data: myFormData,
        success: function(data, textStatus, jqXHR) {
            //grecaptcha.reset();           
            if (data.response.erro) {                
                error(data.response.erro.message);
                //limpar formulario
            } else {
                success("Mensagem enviada com sucesso!");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario
            tratarErro(XMLHttpRequest,XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}
