function recuperarProdutor() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarProdutor();
    }
    $("#imgLogotipo").change(function () {       
        salvarArquivo(this);
    });
    sessionStorage.setItem('logotipo', JSON.stringify([]));    
}

function atualizarProdutor() {
    var myFormData = new FormData();

    var ID_COMPRADOR = 0;
    var ID_PRODUTOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
        ID_PRODUTOR = dataUser.ID_PRODUTOR;
    }

    myFormData.append('idComprador', ID_COMPRADOR);
    myFormData.append('idProdutor', ID_PRODUTOR);

    if ($("#categoriaEmpresa").val() == 0) {
        warning('É necessário informar a categoria da empresa!');
        $("#categoriaEmpresa").focus();
        return false;
    }
    myFormData.append('ID_CATEGORIA_EMPRESA', $("#categoriaEmpresa").val());

    if ($("#tipoNegocio").val() == 0) {
        warning('É necessário informar o tipo de negócio!');
        $("#tipoNegocio").focus();
        return false;
    }
    myFormData.append('ID_TIPO_NEGOCIO', $("#tipoNegocio").val());

    if ($("#nomeFantasia").val() === '') {
        warning('É necessário informar o nome fantasia!');
        $("#nomeFantasia").focus();
        return false;
    }
    myFormData.append('DS_NOME_FANTASIA', $("#nomeFantasia").val());

    if ($("#cnpj").val() === '') {
        warning('É necessário informar o cnpj!');
        $("#cnpj").focus();
        return false;
    }
    myFormData.append('NR_CNPJ', $("#cnpj").val());

    if ($("#razaoSocial").val() === '') {
        warning('É necessário informar a razão social!');
        $("#razaoSocial").focus();
        return false;
    }
    myFormData.append('DS_RAZAO_SOCIAL', $("#razaoSocial").val());

    if ($("#telefone").val() === '') {
        warning('É necessário informar o telefone!');
        $("#telefone").focus();
        return false;
    }
    myFormData.append('DS_TELEFONE', $("#telefone").val());

    if ($("#telefoneComercial").val() === '') {
        warning('É necessário informar o telefone comercial!');
        $("#telefoneComercial").focus();
        return false;
    }
    myFormData.append('DS_TELEFONE_COMERCIAL', $("#telefoneComercial").val());

    if ($("#dateminfundacao").val() === '') {
        warning('É necessário informar a data de nascimento ou fundação!');
        $("#dateminfundacao").focus();
        return false;
    }
    myFormData.append('DT_NASCIMENTO_FUNDACAO', $("#dateminfundacao").val());

    if ($("#qtdEmpregados").val() === '') {
        warning('É necessário informar a data de nascimento ou fundação!');
        $("#qtdEmpregados").focus();
        return false;
    }
    myFormData.append('QT_EMPREGADOS', $("#qtdEmpregados").val());

    if ($("#representanteLegal").val() === '') {
        warning('É necessário informar o nome do representante legal!');
        $("#representanteLegal").focus();
        return false;
    }
    myFormData.append('DS_NOME_REPRESENTANTE_LEGAL', $("#representanteLegal").val());

    if ($("#RGRepresentanteLegal").val() === '') {
        warning('É necessário informar o RG do representante legal!');
        $("#RGRepresentanteLegal").focus();
        return false;
    }
    myFormData.append('NR_RG_REPRESENTANTE_LEGAL', $("#RGRepresentanteLegal").val());

    if ($("#EnderecoRepresentanteLegal").val() === '') {
        warning('É necessário informar o endereço do representante legal!');
        $("#EnderecoRepresentanteLegal").focus();
        return false;
    }
    myFormData.append('DS_ENDERECO_REPRESENTANTE_LEGAL', $("#EnderecoRepresentanteLegal").val());

    if ($("#CPFRepresentante").val() === '') {
        warning('É necessário informar o CPF do representante legal!');
        $("#CPFRepresentante").focus();
        return false;
    }
    myFormData.append('NR_CPF_REPRESENTANTE_LEGAL', $("#CPFRepresentante").val());

    if ($("#dateminrepresentante").val() === '') {
        warning('É necessário informar a data de nascimento do representante legal!');
        $("#dateminrepresentante").focus();
        return false;
    }
    myFormData.append('DT_NASCIMENTO_REPRESENTANTE_LEGAL', $("#dateminrepresentante").val());

    if ($("#endereco").val() === '') {
        warning('É necessário informar o endereço!');
        $("#endereco").focus();
        return false;
    }
    myFormData.append('DS_ENDERECO_PRODUTOR', $("#endereco").val());

    if ($("#cep").val() === '') {
        warning('É necessário informar o CEP!');
        $("#cep").focus();
        return false;
    }
    myFormData.append('NR_CEP_PRODUTOR', $("#cep").val());

    if ($("#nrEndereco").val() === '') {
        warning('É necessário informar o endereço!');
        $("#nrEndereco").focus();
        return false;
    }
    myFormData.append('NR_ENDERECO_PRODUTOR', $("#nrEndereco").val());

    if ($("#territorio").val() === '') {
        warning('É necessário informar o valor do território!');
        $("#territorio").focus();
        return false;
    }
    myFormData.append('DS_TERRITORIO_IDENTIDADE', $("#territorio").val());

    if ($("#complemento").val() === '') {
        warning('É necessário informar o complemento!');
        $("#complemento").focus();
        return false;
    }
    myFormData.append('DS_COMPLEMENTO_PRODUTOR', $("#complemento").val());

    if ($("#tamanhoFabrica").val() === '') {
        warning('É necessário informar o tamanho da fabrica!');
        $("#tamanhoFabrica").focus();
        return false;
    }
    myFormData.append('DS_TAMANHO_FABRICA', $("#tamanhoFabrica").val());

    if ($("#pontoReferencia").val() === '') {
        warning('É necessário informar o ponto de referência!');
        $("#pontoReferencia").focus();
        return false;
    }
    myFormData.append('DS_PONTO_REFERENCIA', $("#pontoReferencia").val());

    if ($("#declaracaoFornecedor").val() === '') {
        warning('É necessário informar a declaração do fornecedor!');
        $("#declaracaoFornecedor").focus();
        return false;
    }
    myFormData.append('DS_DECLARACAO_PRODUTOR', $("#declaracaoFornecedor").val());

    if ($("#cidade").val() == 0) {
        warning('É necessário informar a categoria da empresa!');
        $("#cidade").focus();
        return false;
    }
    myFormData.append('ID_CIDADE', $("#cidade").val());

    if ($("#pronafDaf").val() === '') {
        warning('É necessário informar a declaração do PRONAF-DAF!');
        $("#pronafDaf").focus();
        return false;
    }
    myFormData.append('DS_DECLARACAO_PRONAF_DAF', $("#pronafDaf").val());

    if ($("#enquadramento").val() === '') {
        warning('É necessário informar o enquadramento do agricultor!');
        $("#enquadramento").focus();
        return false;
    }
    myFormData.append('DS_ENQUADRAMENTO_AGRICULTOR', $("#enquadramento").val());

    if ($("#inscricao").val() === '') {
        warning('É necessário informar a inscrição INCRA!');
        $("#inscricao").focus();
        return false;
    }
    myFormData.append('DS_INSCRICAO_INCRA', $("#inscricao").val());
    var logotipo = JSON.parse(sessionStorage.getItem('logotipo'));
    myFormData.append('logotipo', logotipo);

    myFormData.append('IN_COOPERATIVA_ASSOCIACAO', $('#in_cooperativa').prop('checked'));

    $('#span-perfil').text("");
    $('#spinner').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/atualizarProdutor',
        dataType: "json",
        processData: false, // important
        contentType: false, // important
        data: myFormData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            $('#spinner').css('display', 'none');
            $('#span-perfil').text("Atualizar");
            //grecaptcha.reset();           
            if (data.response.erro) {
                error(data.response.erro.message);
                //limpar formulario
            } else {
                success("Fornecedor atualizado com sucesso!");
                // var dataBase64 = window.btoa(JSON.stringify(data.response.sucesso.message));
                // sessionStorage.setItem('tend-compr', dataBase64); 
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function carregarProdutor() {
    var ID_COMPRADOR = 0;
    var ID_PRODUTOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
        ID_PRODUTOR = dataUser.ID_PRODUTOR;
    }
    var myFormData = new FormData();
    myFormData.append('idProdutor', ID_PRODUTOR);
    myFormData.append('idComprador', ID_COMPRADOR);
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/fornecedor',
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
                appendCidade('#cidade', data.response.sucesso.message.cidades);
                appendCategoriaEmpresa('#categoriaEmpresa', data.response.sucesso.message.categoriaEmpresa);
                appendTipoNegocio('#tipoNegocio', data.response.sucesso.message.tipoNegocioLista, data.response.sucesso.message.dadosUsuario);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendDadosProdutor(usuario) {

    if (usuario.length > 0) {
        //Dados Fornecedor
        $("#nomeFantasia").val(usuario[0].DS_NOME_FANTASIA);
        $("#cnpj").val(usuario[0].NR_CNPJ);
        $("#razaoSocial").val(usuario[0].DS_RAZAO_SOCIAL);
        $("#telefone").val(usuario[0].DS_TELEFONE);
        $("#telefoneComercial").val(usuario[0].DS_TELEFONE_COMERCIAL);
        var dataFundacao = usuario[0].DT_NASCIMENTO_FUNDACAO.split(" ");
        $("#dateminfundacao").val(dataFundacao[0]);
        $("#qtdEmpregados").val(usuario[0].QT_EMPREGADOS);
        $("#representanteLegal").val(usuario[0].DS_NOME);
        $("#RGRepresentanteLegal").val(usuario[0].NR_RG);
        $("#EnderecoRepresentanteLegal").val(usuario[0].DS_ENDERECO);
        $("#CPFRepresentante").val(usuario[0].NR_CPF);
        var dataRepresentante = usuario[0].DT_NASCIMENTO.split(" ");
        $("#dateminrepresentante").val(dataRepresentante[0]);
        //Dados Básicos
        $("#cep").val(usuario[0].NR_CEP);
        $("#endereco").val(usuario[0].DS_ENDERECO);
        $("#nrEndereco").val(usuario[0].NR_ENDERECO);
        $("#territorio").val(usuario[0].DS_TERRITORIO_IDENTIDADE);
        $("#complemento").val(usuario[0].DS_COMPLEMENTO);
        $("#tamanhoFabrica").val(usuario[0].DS_TAMANHO_FABRICA);
        $("#pontoReferencia").val(usuario[0].DS_PONTO_REFERENCIA);
        $("#declaracaoFornecedor").val(usuario[0].DS_DECLARACAO_PRODUTOR);
        $("#pronafDaf").val(usuario[0].DS_DECLARACAO_PRONAF_DAF);
        $("#enquadramento").val(usuario[0].DS_ENQUADRAMENTO_AGRICULTOR);
        $("#inscricao").val(usuario[0].DS_INSCRICAO_INCRA);

        $("#categoriaEmpresa").val(usuario[0].ID_CATEGORIA_EMPRESA);
        $("#tipoNegocio").val(usuario[0].ID_TIPO_NEGOCIO);
        $("#cidade").val(usuario[0].ID_CIDADE);

        if (usuario[0].IN_COOPERATIVA_ASSOCIACAO == 1) {
            $("#in_cooperativa").prop('checked', true);
        } else {
            $("#in_cooperativa").prop('checked', false);
        }
    }
}

function appendCidade(idHtml, cidades) {
    //document.querySelector("#input_cidade > div > ul").setAttribute('id', 'list_cidade');
    if (cidades.length > 0) {
        for (var i = 0; i < cidades.length; i++) {
            card_cidade = '';
            card_cidade = card_cidade + '<option value="' + cidades[i].ID_CIDADE + '">' + cidades[i].DS_CIDADE + '</option>';
            $(idHtml).append(card_cidade);
            $('#list_cidade').append(card_cidade);
            $('#list_cidade').css('width', '100%');
            $('#list_cidade').css('overflow-x', 'hidden');
            $('#list_cidade').css('overflow-y', 'scroll');
            $('#list_cidade').css('height', '200px');
            $('#list_cidade').css('white-space', 'nowrap');
        }
    }
}

function appendCategoriaEmpresa(idHtml, categoriaEmpresa) {
    //document.querySelector("#input_categoria_empresa > div > ul").setAttribute('id', 'list_categoria_empresa');
    if (categoriaEmpresa.length > 0) {
        for (var i = 0; i < categoriaEmpresa.length; i++) {
            card_categoria_empresa = '';
            card_categoria_empresa = card_categoria_empresa + '<option value="' + categoriaEmpresa[i].ID_CATEGORIA_EMPRESA + '">' + categoriaEmpresa[i].DS_CATEGORIA_EMPRESA + '</option>';
            $(idHtml).append(card_categoria_empresa);
            $('#list_categoria_empresa').append(card_categoria_empresa);
            $('#list_categoria_empresa').css('width', '100%');
            $('#list_categoria_empresa').css('overflow-x', 'hidden');
            $('#list_categoria_empresa').css('overflow-y', 'scroll');
            $('#list_categoria_empresa').css('height', '200px');
            $('#list_categoria_empresa').css('white-space', 'nowrap');
        }
    }
}

function appendTipoNegocio(idHtml, tipoNegocio, dadosProdutor) {
    //document.querySelector("#input_tipo_negocio > div > ul").setAttribute('id', 'list_tipo_negocio');
    if (tipoNegocio.length > 0) {
        for (var i = 0; i < tipoNegocio.length; i++) {
            card_tipo_negocio = '';
            card_tipo_negocio = card_tipo_negocio + '<option value="' + tipoNegocio[i].ID_TIPO_NEGOCIO + '">' + tipoNegocio[i].DS_TIPO_NEGOCIO + '</option>';
            $(idHtml).append(card_tipo_negocio);
            $('#list_tipo_negocio').append(card_tipo_negocio);
            $('#list_tipo_negocio').css('width', '100%');
            $('#list_tipo_negocio').css('overflow-x', 'hidden');
            $('#list_tipo_negocio').css('overflow-y', 'scroll');
            $('#list_tipo_negocio').css('height', '200px');
            $('#list_tipo_negocio').css('white-space', 'nowrap');
        }
    }
    appendDadosProdutor(dadosProdutor);
}

function salvarArquivo(input) {
    inputfiles = input.files;
    var myFormData = new FormData();
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }
    if (inputfiles[0].type.match('image/png')
        || inputfiles[0].type.match('image/jpg')
        || inputfiles[0].type.match('image/jpeg')
    ) {

        files = Object.values(inputfiles);
        files.forEach(function (file) {
            myFormData.append('myFiles[]', file);
        });
    } else {
        error('Tipo de arquivo não suportado, apenas imagens do tipo PNG, JPG e JPEG são aceitas!');
        return false;
    }

    myFormData.append('idComprador', ID_COMPRADOR);
    var uploadingFiles = JSON.parse(sessionStorage.getItem('logotipo'));
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
                    sessionStorage.setItem('logotipo', JSON.stringify(uploadingFiles));
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}
