function login() {

    if ($("#email").val() === '') {
        warning('É necessário informar o email!');
        $("#email").focus();
        return false;
    }

    DS_EMAIL = $("#email").val();
    DS_SENHA = $("#password").val();

    if (!validarEmail(DS_EMAIL)) {       
        return false;
    }

    if (!validarTamanhoSenha(DS_SENHA)) {       
        return false;
    }

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/login',
        dataType: "json",
        data: { "email": DS_EMAIL, "password": DS_SENHA},
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {           
            if (data.message) {
                //limpar formulario
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT               
                var dataBase64 = window.btoa(JSON.stringify(data.response.sucesso.message));
                sessionStorage.setItem('tend-compr', dataBase64);

                window.location.href = '/index.html';
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) { 
            //limpar formulario
            error(XMLHttpRequest.responseJSON.response.erro.message);
        }
    });

}

function cadastrar() {

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

    if ($("#senha").val() === '') {
        alert('É necessário informar a senha!');
        $("#senha").focus();
        return false;
    }

    DS_SENHA = $("#senha").val();
    DS_CONFIRMAR_SENHA = $("#confirmarSenha").val();
    IN_TERMOS = $('#termos').is(":checked");
    IN_COMPRADOR = $('#comprador').is(":checked");
    IN_FORNECEDOR = $('#fornecedor').is(":checked");

    validarEmail(DS_EMAIL);
    validarTamanhoSenha(DS_SENHA);
    validarSenhas(DS_SENHA, DS_CONFIRMAR_SENHA);
    validarTermoDeUso(IN_TERMOS);

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/register',
        dataType: "json",
        data: {
            "DS_NOME": DS_NOME,
            "DS_EMAIL": DS_EMAIL,
            "DS_SENHA": DS_SENHA,
            "IN_TERMOS": IN_TERMOS,
            "IN_COMPRADOR": IN_COMPRADOR,
            "IN_FORNECEDOR": IN_FORNECEDOR
        },
        success: function(data, textStatus, jqXHR) {
            //grecaptcha.reset();           
            if (data.response.erro) {                
                error(data.response.erro.message);
                //limpar formulario
            } else {
                success("Usuário cadastrado com sucesso!");
                var dataBase64 = window.btoa(JSON.stringify(data.response.sucesso.message));
                sessionStorage.setItem('tend-compr', dataBase64); 
                localStorage.setItem('ID_COMPRADOR', data.response.sucesso.message.ID_COMPRADOR); 
                window.location.href = '/feedbackCadastro.html';
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario
            tratarErro(XMLHttpRequest,XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}

function resetarSenha() {

    if ($("#email").val() === '') {
        warning('É necessário informar o email!');
        $("#email").focus();
        return false;
    }
    DS_EMAIL = $("#email").val();

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/enviarEmailRecuperarSenha',
        dataType: "json",
        data: {   
            "DS_EMAIL": DS_EMAIL
        },
        success: function(data, textStatus, jqXHR) {      
            if (data.response.erro) {                
                error(data.response.erro.message);
                //limpar formulario
            } else {
                success("E-mail enviado com sucesso!");
                window.location.href = '/login.html';
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario
            tratarErro(XMLHttpRequest,XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}

function validarCadastro() {
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    var ID_COMPRADOR = localStorage.getItem('ID_COMPRADOR');
    $.ajax({
        type: "GET",
        url: 'https://testetendering.myappnow.com.br/api/usuario/validacao/email/'+ID_COMPRADOR,
        dataType: "json",
        success: function(data, textStatus, jqXHR) {      
            if (data.response.erro) {                
                error(data.response.erro.message);
                //limpar formulario
            } else {
                success("Cadastro ativado com sucesso!");
                sessionStorage.removeItem('tend-compr');
                setTimeout(() => {
                    window.location.href = '/login.html';
                  }, 2000);
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario
            error(XMLHttpRequest.responseJSON.response.erro.message);
            console.log(XMLHttpRequest.responseJSON.response.erro.message);
        }
    });
}