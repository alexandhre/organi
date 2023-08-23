function redirecionarPesquisa(pagina) {
    sessionStorage.setItem('pagina', pagina);
    window.location.href = '/pesquisa';
}

function indexPerfil() {    
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarPerfil();
    } 
}

function atualizarComprador() {

    if ($("#nome").val() === '') {
        alert('É necessário informar o nome!');
        $("#nome").focus();
        return false;
    }
    DS_NOME = $("#nome").val();

    if ($("#sobrenome").val() === '') {
        alert('É necessário informar o sobrenome!');
        $("#sobrenome").focus();
        return false;
    }
    DS_SOBRENOME = $("#sobrenome").val();

    if ($("#cpf").val() === '') {
        alert('É necessário informar o cpf!');
        $("#cpf").focus();
        return false;
    }
    NR_CPF = $("#cpf").val();

    if ($("#email").val() === '') {
        alert('É necessário informar o email!');
        $("#email").focus();
        return false;
    }
    DS_EMAIL = $("#email").val();
    DS_FACEBOOK = $("#facebook").val();
    DS_GMAIL = $("#gmail").val();
    DS_INSTAGRAM = $("#instagram").val();

    if ($("#telefone").val() === '') {
        alert('É necessário informar o telefone!');
        $("#telefone").focus();
        return false;
    }
    NR_TELEFONE = $("#telefone").val();

    if ($("#endereco").val() === '') {
        alert('É necessário informar o endereço!');
        $("#endereco").focus();
        return false;
    }
    DS_ENDERECO = $("#endereco").val();
    DS_COMPLEMENTO = $("#complemento").val();

    if ($("#id_cidade").val() == 0) {
        alert('É necessário informar a cidade!');
        $("#id_cidade").focus();
        return false;
    }
    ID_CIDADE = $("#id_cidade").val();

    if ($("#nr_endereco").val() === '') {
        alert('É necessário informar o número endereço!');
        $("#nr_endereco").focus();
        return false;
    }
    NR_ENDERECO = $("#nr_endereco").val();

    if ($("#cep").val() === '') {
        alert('É necessário informar o CEP!');
        $("#cep").focus();
        return false;
    }
    NR_CEP = $("#cep").val();
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $('#span-perfil').text("");
    $('#spinner').css('display','block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/atualizarComprador',
        crossDomain: true,
        dataType: "json",
        data: {
            "DS_NOME": DS_NOME,
            "DS_SOBRENOME": DS_SOBRENOME,
            "NR_CPF": NR_CPF,
            "DS_EMAIL": DS_EMAIL,
            "facebook": DS_FACEBOOK,
            "gmail": DS_GMAIL,
            "instagram": DS_INSTAGRAM,
            "endereco": DS_ENDERECO,
            "complemento": DS_COMPLEMENTO,
            "id_cidade": ID_CIDADE,
            "nr_endereco": NR_ENDERECO,
            "telefone": NR_TELEFONE,
            "cep": NR_CEP,
            'idComprador': ID_COMPRADOR
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data, textStatus, jqXHR) {
            $('#spinner').css('display','none');
            $('#span-perfil').text("Atualizar");
            //grecaptcha.reset();           
            if (data.response.erro) {                
                error(data.response.erro.message);
                //limpar formulario
            } else {
                success("Comprador atualizado com sucesso!");
                // var dataBase64 = window.btoa(JSON.stringify(data.response.sucesso.message));
                // sessionStorage.setItem('tend-compr', dataBase64); 
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function carregarPerfil() {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/perfil',
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
                appendCidade('#id_cidade', data.response.sucesso.message.cidades, data.response.sucesso.message.usuario);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendDadosUsuario(usuario) {

    if (usuario.length > 0) {
        $("#nome").val(usuario[0].DS_NOME);
        $("#sobrenome").val(usuario[0].DS_SOBRENOME);
        $("#cpf").val(usuario[0].NR_CPF);
        $("#email").val(usuario[0].DS_EMAIL);
        $("#facebook").val(usuario[0].DS_FACEBOOK);
        $("#gmail").val(usuario[0].DS_GMAIL);
        $("#instagram").val(usuario[0].DS_INSTAGRAM);
        $("#telefone").val(usuario[0].NR_TELEFONE);
        $("#endereco").val(usuario[0].DS_ENDERECO_COMPRADOR);
        $("#complemento").val(usuario[0].DS_COMPLEMENTO_COMPRADOR);
        $("#id_cidade").val(usuario[0].ID_CIDADE_COMPRADOR).change();
        $("#nr_endereco").val(usuario[0].NR_ENDERECO_COMPRADOR);
        $("#cep").val(usuario[0].NR_CEP_COMPRADOR);     
    }
}

function appendCidade(idHtml, cidades, dadosUsuario) {

    if (cidades.length > 0) {
        for (var i = 0; i < cidades.length; i++) {
            card_cidade = '';
                card_cidade = card_cidade + '<option value="'+cidades[i].ID_CIDADE+'">'+cidades[i].DS_CIDADE+'</option>';
                $(idHtml).append(card_cidade);
                $('.list').append(card_cidade);
                $('.list').css('width', '100%');
                $('.list').css('overflow-x', 'hidden');
                $('.list').css('overflow-y', 'scroll');
                $('.list').css('height', '200px');
                $('.list').css('white-space', 'nowrap');
        }
    }
    appendDadosUsuario(dadosUsuario);
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
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
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
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}



