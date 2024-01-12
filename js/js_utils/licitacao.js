function indexLicitacao() {
    if (!sessionStorage.getItem('tend-compr')) {
        window.location.href = "login.html";
    } else {
        carregarLicitacoes(1);
    }
}

function carregarLicitacoes(currentPage) {
    var ID_COMPRADOR = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }

    var listaSituacao = new Array();
    $("input:checked").each(function() {
        listaSituacao.push($(this).val());
    });    
    console.log(listaSituacao);
    var myFormData = new FormData();
    myFormData.append('idComprador', ID_COMPRADOR);
    myFormData.append('listaSituacao', listaSituacao);
    myFormData.append('abrangencia', $("#abrangencia").val());
    myFormData.append('periodo', $("#periodo").val());

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/licitacao?page=' + currentPage,
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
                $("#lista_licitacoes").empty();
                appendLicitacoes('#lista_licitacoes', data.response.sucesso.message.licitacoes);
                appendPagination('#pagination', data.response.sucesso.message.paginationLicitacao, currentPage);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendLicitacoes(idHtml, licitacoes) {

    if (licitacoes.length > 0) {
        for (var i = 0; i < licitacoes.length; i++) {
            var situacao = '';
            if (licitacoes[i].ID_SITUACAO == 1) {
                situacao = 'Aberta';
            } else if (licitacoes[i].ID_SITUACAO == 2) {
                situacao = 'Anulada';
            } else if (licitacoes[i].ID_SITUACAO == 3) {
                situacao = 'Em disputa';
            } else if (licitacoes[i].ID_SITUACAO == 4) {
                situacao = 'Fechada';
            } else if (licitacoes[i].ID_SITUACAO == 5) {
                situacao = 'Homologada';
            } else if (licitacoes[i].ID_SITUACAO == 6) {
                situacao = 'Publicada';
            } else if (licitacoes[i].ID_SITUACAO == 7) {
                situacao = 'Revogada';
            }

            var modalidade = '';
            if (licitacoes[i].DS_MODALIDADE == 1) {
                modalidade = 'Pregão Eletrônico';
            }

            card_licitacoes = '';
            card_licitacoes = card_licitacoes + '<tr>' +
                '<td>' + licitacoes[i].DS_EDITAL + '</td>' +
                '<td>' + situacao + '</td>' +
                '<td>' + licitacoes[i].VL_BASE + '</td>' +
                '<td>' + modalidade + '</td>' +
                '<td>' + moment(licitacoes[i].DT_ACOLHIMENTO_PROPOSTAS).format("DD/MM/YYYY") + '</td>' +
                '<td>' + moment(licitacoes[i].DT_FINAL_DISPUTA).format("DD/MM/YYYY") + '</td>' +
                '<td>' +
                '<a onclick="mudarPagina(' + licitacoes[i].ID_LICITACAO + ');" class="btn btn-default">' +
                '<i class="fa fa-edit"></i>' +
                '</a>' +
                '</td>' +
                '</tr>';
            $(idHtml).append(card_licitacoes);
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

function validarDados() {

    if ($("#cliente").val() == '') {
        warning('Informe o nome do cliente!');
        $("#cliente").focus();
        return false;
    }
    $('#cliente_confirmacao').text($("#cliente").val());

    if ($("#unidade_organizacional").val() == '') {
        warning('Informe a Unidade Organizacional!');
        $("#unidade_organizacional").focus();
        return false;
    }
    $('#unidade_organizacional_confirmacao').text($("#unidade_organizacional").val());

    if ($("#valor_base").val() == '') {
        warning('Informe o valor base da licitação!');
        $("#valor_base").focus();
        return false;
    }
    $('#valor_base_confirmacao').text($("#valor_base").val());

    if ($("#edital").val() == '') {
        warning('Informe o Edital!');
        $("#edital").focus();
        return false;
    }
    $('#edital_confirmacao').text($("#edital").val());

    if ($("#processo").val() == '') {
        warning('Informe o Processo!');
        $("#processo").focus();
        return false;
    }
    $('#processo_confirmacao').text($("#processo").val());

    if ($("#modalidade_tipo").val() == 0) {
        warning('Selecione a Modalidade/Tipo!');
        $("#modalidade_tipo").focus();
        return false;
    }
    $('#modalidade_tipo_confirmacao').text($("#modalidade_tipo option:selected").text());

    if ($("#fornecedor").val() == 0) {
        warning('Selecione a Participação do Fornecedor!');
        $("#fornecedor").focus();
        return false;
    }
    $('#fornecedor_confirmacao').text($("#fornecedor option:selected").text());

    if ($("#forma_conducao").val() == 0) {
        warning('Selecione a Forma de Condução!');
        $("#forma_conducao").focus();
        return false;
    }
    $('#forma_conducao_confirmacao').text($("#forma_conducao option:selected").text());

    if ($("#tipo").val() == 0) {
        warning('Selecione o Tipo!');
        $("#tipo").focus();
        return false;
    }
    $('#tipo_confirmacao').text($("#tipo option:selected").text());

    if ($("#moeda").val() == 0) {
        warning('Selecione a Moeda!');
        $("#moeda").focus();
        return false;
    }
    $('#moeda_confirmacao').text($("#moeda option:selected").text());

    if ($("#prazo_impugnacao").val() == 0) {
        warning('Selecione o Prazo para Impugnação!');
        $("#prazo_impugnacao").focus();
        return false;
    }
    $('#prazo_impugnacao_confirmacao').text($("#prazo_impugnacao option:selected").text());

    if ($("#inicioProposta").val() == '') {
        warning('Informe a data de Inicio do Acolhimento de Propostas!');
        $("#inicioProposta").focus();
        return false;
    }
    $('#inicioProposta_confirmacao').text($("#inicioProposta").val());

    if ($("#aberturaProposta").val() == '') {
        warning('Informe a data de Abertura das Propostas!');
        $("#aberturaProposta").focus();
        return false;
    }
    $('#aberturaProposta_confirmacao').text($("#aberturaProposta").val());

    if ($("#dataHoraDisputa").val() == '') {
        warning('Informe a Data e Hora da Disputa!');
        $("#dataHoraDisputa").focus();
        return false;
    }
    $('#dataHoraDisputa_confirmacao').text($("#dataHoraDisputa").val());

    if ($("#finalDisputa").val() == '') {
        warning('Informe a data Final da Disputa!');
        $("#finalDisputa").focus();
        return false;
    }
    $('#finalDisputa_confirmacao').text($("#finalDisputa").val());

    if ($("#moedaProposta").val() == 0) {
        warning('Selecione a Moeda da Proposta!');
        $("#moedaProposta").focus();
        return false;
    }
    $('#moeda_proposta_confirmacao').text($("#moedaProposta option:selected").text());

    if ($("#resumo").val() == '') {
        warning('Informe o Resumo da Licitação!');
        $("#resumo").focus();
        return false;
    }
    $('#resumo_confirmacao').text($("#resumo").val());

    if ($("#nacional").prop("checked")) {
        $('#tipo_cadastro_confirmacao').text("Nacional");
    } else if ($("#regional").prop("checked")) {
        $('#tipo_cadastro_confirmacao').text("Regional");
    }

    if ($("#aquisicao").prop("checked")) {
        $('#abrangencia_confirmacao').text("Aquisição");
    } else if ($("#simulacao").prop("checked")) {
        $('#abrangencia_confirmacao').text("Simulação");
    }

    $("#custom-content-below-confirmar-tab").attr("href", "#custom-content-below-confirmar");
    $("#custom-content-below-confirmar-tab").attr("data-toggle", "pill");
    $('#custom-content-below-confirmar-tab').click();
}

function salvarLicitacao() {
    var id_comprador = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        id_comprador = dataUser.ID_COMPRADOR;
    }
    var myFormData = new FormData();
    myFormData.append('idComprador', id_comprador);
    myFormData.append('cliente', $("#cliente").val());
    myFormData.append('unidade_organizacional', $("#unidade_organizacional").val());
    myFormData.append('valor_base', $("#valor_base").val());
    myFormData.append('edital', $("#edital").val());
    myFormData.append('processo', $("#processo").val());
    myFormData.append('modalidade_tipo', $("#modalidade_tipo").val());
    myFormData.append('fornecedor', $("#fornecedor").val());
    myFormData.append('forma_conducao', $("#forma_conducao").val());
    myFormData.append('tipo', $("#tipo").val());
    myFormData.append('moeda', $("#moeda").val());
    myFormData.append('prazo_impugnacao', $("#prazo_impugnacao").val());
    myFormData.append('inicioProposta', $("#inicioProposta").val());
    myFormData.append('aberturaProposta', $("#aberturaProposta").val());
    myFormData.append('dataHoraDisputa', $("#dataHoraDisputa").val());
    myFormData.append('finalDisputa', $("#finalDisputa").val());
    myFormData.append('moedaProposta', $("#moedaProposta").val());
    myFormData.append('resumo', $("#resumo").val());
    myFormData.append('nacional', $("#nacional").prop("checked"));
    myFormData.append('regional', $("#regional").prop("checked"));
    myFormData.append('aquisicao', $("#aquisicao").prop("checked"));
    myFormData.append('simulacao', $("#simulacao").prop("checked"));

    console.log(myFormData);

    $('#span-licitacao').text("");
    $('#spinner').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/cadastrarLicitacao',
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

//Editar Licitacao
function carregarDadosLicitacao() {
    var ID_COMPRADOR = 0;
    var id_licitacao = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }

    if (sessionStorage.getItem('id_licitacao')) {
        id_licitacao = JSON.parse(sessionStorage.getItem('id_licitacao'));
    }

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/dadosLicitacao',
        dataType: "json",
        data: {
            'idComprador': ID_COMPRADOR,
            'id_licitacao': id_licitacao,
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT              
                appendDadosLicitacao(data.response.sucesso.message.licitacoes);
                appendLotes('#lista_lotes', data.response.sucesso.message.lotes);
                $("#heart-number").text(data.response.sucesso.message.numberFavorito);
                $("#cart-number").text(data.response.sucesso.message.numberCarrinho);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendDadosLicitacao(licitacao) {

    if (licitacao.length > 0) {
        for (var i = 0; i < licitacao.length; i++) {
            $('#numero_licitacao').text('Licitação Nº ' + licitacao[i].DS_EDITAL);
            $('#numero_licitacao_confirmar').text('Licitação Nº ' + licitacao[i].DS_EDITAL);
            sessionStorage.setItem('id_licitacao_cliente', licitacao[i].ID_LICITACAO_CLIENTE);
            sessionStorage.setItem('id_licitacao', licitacao[i].ID_LICITACAO);
            $('#cliente').val(licitacao[i].DS_NOME_CLIENTE);
            $('#unidade_organizacional').val(licitacao[i].DS_UNIDADE_ORGANIZACIONAL);
            $('#valor_base').val(licitacao[i].VL_BASE);
            $('#edital').val(licitacao[i].DS_EDITAL);
            $('#processo').val(licitacao[i].DS_PROCESSO);

            $('#modalidade_tipo').val(licitacao[i].DS_MODALIDADE);
            $('#modalidade_tipo').niceSelect('update');
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');

            $('#fornecedor').val(licitacao[i].DS_PARTICIPACAO_FORNECEDOR);
            $('#fornecedor').niceSelect('update');
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');

            $('#forma_conducao').val(licitacao[i].DS_FORMA_CONDUCAO);
            $('#forma_conducao').niceSelect('update');
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');

            $('#tipo').val(licitacao[i].DS_TIPO_PRECO);
            $('#tipo').niceSelect('update');
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');

            $('#moeda').val(licitacao[i].MOEDA);
            $('#moeda').niceSelect('update');
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');

            $('#prazo_impugnacao').val(licitacao[i].DS_PRAZO_IMPUGNACAO);
            $('#prazo_impugnacao').niceSelect('update');
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');

            $('#inicioProposta').val(moment(licitacao[i].DT_ACOLHIMENTO_PROPOSTAS).format("DD/MM/YYYY"));
            $('#aberturaProposta').val(moment(licitacao[i].DT_ABERTURA_PROPOSTAS).format("DD/MM/YYYY"));
            $('#dataHoraDisputa').val(moment(licitacao[i].DT_DISPUTA).format("DD/MM/YYYY"));
            $('#finalDisputa').val(moment(licitacao[i].DT_FINAL_DISPUTA).format("DD/MM/YYYY"));

            $('#moeda_proposta').val(licitacao[i].DS_MOEDA_PROPOSTA);
            $('#moeda_proposta').niceSelect('update');
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');

            $('#resumo').val(licitacao[i].DS_RESUMO);

            if (licitacao[i].DS_TIPO_CADASTRO == 1) {
                $("#nacional").prop("checked", true);
            } else if (licitacao[i].DS_TIPO_CADASTRO == 0) {
                $("#regional").prop("checked", true);
            }

            if (licitacao[i].DS_ABRANGENCIA == 1) {
                $("#aquisicao").prop("checked", true);
            } else if (licitacao[i].DS_ABRANGENCIA == 0) {
                $("#simulacao").prop("checked", true);
            }

            // $("#custom-content-below-confirmar-tab").attr("href", "#custom-content-below-confirmar");
            // $("#custom-content-below-confirmar-tab").attr("data-toggle", "pill");
            //$('#custom-content-below-confirmar-tab').click();
        }
    }
}

function validarDadosEditar() {

    if ($("#cliente").val() == '') {
        warning('Informe o nome do cliente!');
        $("#cliente").focus();
        return false;
    }
    $('#cliente_confirmacao').text($("#cliente").val());

    if ($("#unidade_organizacional").val() == '') {
        warning('Informe a Unidade Organizacional!');
        $("#unidade_organizacional").focus();
        return false;
    }
    $('#unidade_organizacional_confirmacao').text($("#unidade_organizacional").val());

    if ($("#valor_base").val() == '') {
        warning('Informe o valor base da licitação!');
        $("#valor_base").focus();
        return false;
    }
    $('#valor_base_confirmacao').text($("#valor_base").val());

    if ($("#edital").val() == '') {
        warning('Informe o Edital!');
        $("#edital").focus();
        return false;
    }
    $('#edital_confirmacao').text($("#edital").val());

    if ($("#processo").val() == '') {
        warning('Informe o Processo!');
        $("#processo").focus();
        return false;
    }
    $('#processo_confirmacao').text($("#processo").val());

    if ($("#modalidade_tipo").val() == 0) {
        warning('Selecione a Modalidade/Tipo!');
        $("#modalidade_tipo").focus();
        return false;
    }
    $('#modalidade_tipo_confirmacao').text($("#modalidade_tipo option:selected").text());

    if ($("#fornecedor").val() == 0) {
        warning('Selecione a Participação do Fornecedor!');
        $("#fornecedor").focus();
        return false;
    }
    $('#fornecedor_confirmacao').text($("#fornecedor option:selected").text());

    if ($("#forma_conducao").val() == 0) {
        warning('Selecione a Forma de Condução!');
        $("#forma_conducao").focus();
        return false;
    }
    $('#forma_conducao_confirmacao').text($("#forma_conducao option:selected").text());

    if ($("#tipo").val() == 0) {
        warning('Selecione o Tipo!');
        $("#tipo").focus();
        return false;
    }
    $('#tipo_confirmacao').text($("#tipo option:selected").text());

    if ($("#moeda").val() == 0) {
        warning('Selecione a Moeda!');
        $("#moeda").focus();
        return false;
    }
    $('#moeda_confirmacao').text($("#moeda option:selected").text());

    if ($("#prazo_impugnacao").val() == 0) {
        warning('Selecione o Prazo para Impugnação!');
        $("#prazo_impugnacao").focus();
        return false;
    }
    $('#prazo_impugnacao_confirmacao').text($("#prazo_impugnacao option:selected").text());

    if ($("#inicioProposta").val() == '') {
        warning('Informe a data de Inicio do Acolhimento de Propostas!');
        $("#inicioProposta").focus();
        return false;
    }
    $('#inicioProposta_confirmacao').text($("#inicioProposta").val());

    if ($("#aberturaProposta").val() == '') {
        warning('Informe a data de Abertura das Propostas!');
        $("#aberturaProposta").focus();
        return false;
    }
    $('#aberturaProposta_confirmacao').text($("#aberturaProposta").val());

    if ($("#dataHoraDisputa").val() == '') {
        warning('Informe a Data e Hora da Disputa!');
        $("#dataHoraDisputa").focus();
        return false;
    }
    $('#dataHoraDisputa_confirmacao').text($("#dataHoraDisputa").val());

    if ($("#finalDisputa").val() == '') {
        warning('Informe a data Final da Disputa!');
        $("#finalDisputa").focus();
        return false;
    }
    $('#finalDisputa_confirmacao').text($("#finalDisputa").val());

    if ($("#moeda_proposta").val() == 0) {
        warning('Selecione a Moeda da Proposta!');
        $("#moeda_proposta").focus();
        return false;
    }
    $('#moeda_proposta_confirmacao').text($("#moeda_proposta option:selected").text());

    if ($("#resumo").val() == '') {
        warning('Informe o Resumo da Licitação!');
        $("#resumo").focus();
        return false;
    }
    $('#resumo_confirmacao').text($("#resumo").val());

    if ($("#nacional").prop("checked")) {
        $('#tipo_cadastro_confirmacao').text("Nacional");
    } else if ($("#regional").prop("checked")) {
        $('#tipo_cadastro_confirmacao').text("Regional");
    }

    if ($("#aquisicao").prop("checked")) {
        $('#abrangencia_confirmacao').text("Aquisição");
    } else if ($("#simulacao").prop("checked")) {
        $('#abrangencia_confirmacao').text("Simulação");
    }

    $("#custom-content-below-lote-tab").attr("href", "#custom-content-below-lote");
    $("#custom-content-below-lote-tab").attr("data-toggle", "pill");
    $('#custom-content-below-lote-tab').click();
}

function validarLotes() {

    if ($("#cliente").val() == '') {
        warning('Informe o nome do cliente!');
        $("#cliente").focus();
        return false;
    }
    $('#cliente_confirmacao').text($("#cliente").val());

    if ($("#unidade_organizacional").val() == '') {
        warning('Informe a Unidade Organizacional!');
        $("#unidade_organizacional").focus();
        return false;
    }
    $('#unidade_organizacional_confirmacao').text($("#unidade_organizacional").val());

    if ($("#valor_base").val() == '') {
        warning('Informe o valor base da licitação!');
        $("#valor_base").focus();
        return false;
    }
    $('#valor_base_confirmacao').text($("#valor_base").val());

    if ($("#edital").val() == '') {
        warning('Informe o Edital!');
        $("#edital").focus();
        return false;
    }
    $('#edital_confirmacao').text($("#edital").val());

    if ($("#processo").val() == '') {
        warning('Informe o Processo!');
        $("#processo").focus();
        return false;
    }
    $('#processo_confirmacao').text($("#processo").val());

    if ($("#modalidade_tipo").val() == 0) {
        warning('Selecione a Modalidade/Tipo!');
        $("#modalidade_tipo").focus();
        return false;
    }
    $('#modalidade_tipo_confirmacao').text($("#modalidade_tipo option:selected").text());

    if ($("#fornecedor").val() == 0) {
        warning('Selecione a Participação do Fornecedor!');
        $("#fornecedor").focus();
        return false;
    }
    $('#fornecedor_confirmacao').text($("#fornecedor option:selected").text());

    if ($("#forma_conducao").val() == 0) {
        warning('Selecione a Forma de Condução!');
        $("#forma_conducao").focus();
        return false;
    }
    $('#forma_conducao_confirmacao').text($("#forma_conducao option:selected").text());

    if ($("#tipo").val() == 0) {
        warning('Selecione o Tipo!');
        $("#tipo").focus();
        return false;
    }
    $('#tipo_confirmacao').text($("#tipo option:selected").text());

    if ($("#moeda").val() == 0) {
        warning('Selecione a Moeda!');
        $("#moeda").focus();
        return false;
    }
    $('#moeda_confirmacao').text($("#moeda option:selected").text());

    if ($("#prazo_impugnacao").val() == 0) {
        warning('Selecione o Prazo para Impugnação!');
        $("#prazo_impugnacao").focus();
        return false;
    }
    $('#prazo_impugnacao_confirmacao').text($("#prazo_impugnacao option:selected").text());

    if ($("#inicioProposta").val() == '') {
        warning('Informe a data de Inicio do Acolhimento de Propostas!');
        $("#inicioProposta").focus();
        return false;
    }
    $('#inicioProposta_confirmacao').text($("#inicioProposta").val());

    if ($("#aberturaProposta").val() == '') {
        warning('Informe a data de Abertura das Propostas!');
        $("#aberturaProposta").focus();
        return false;
    }
    $('#aberturaProposta_confirmacao').text($("#aberturaProposta").val());

    if ($("#dataHoraDisputa").val() == '') {
        warning('Informe a Data e Hora da Disputa!');
        $("#dataHoraDisputa").focus();
        return false;
    }
    $('#dataHoraDisputa_confirmacao').text($("#dataHoraDisputa").val());

    if ($("#finalDisputa").val() == '') {
        warning('Informe a data Final da Disputa!');
        $("#finalDisputa").focus();
        return false;
    }
    $('#finalDisputa_confirmacao').text($("#finalDisputa").val());

    if ($("#moeda_proposta").val() == 0) {
        warning('Selecione a Moeda da Proposta!');
        $("#moeda_proposta").focus();
        return false;
    }
    $('#moeda_proposta_confirmacao').text($("#moeda_proposta option:selected").text());

    if ($("#resumo").val() == '') {
        warning('Informe o Resumo da Licitação!');
        $("#resumo").focus();
        return false;
    }
    $('#resumo_confirmacao').text($("#resumo").val());

    if ($("#nacional").prop("checked")) {
        $('#tipo_cadastro_confirmacao').text("Nacional");
    } else if ($("#regional").prop("checked")) {
        $('#tipo_cadastro_confirmacao').text("Regional");
    }

    if ($("#aquisicao").prop("checked")) {
        $('#abrangencia_confirmacao').text("Aquisição");
    } else if ($("#simulacao").prop("checked")) {
        $('#abrangencia_confirmacao').text("Simulação");
    }

    $("#custom-content-below-confirmar-tab").attr("href", "#custom-content-below-confirmar");
    $("#custom-content-below-confirmar-tab").attr("data-toggle", "pill");
    $('#custom-content-below-confirmar-tab').click();
}

function mudarPagina(ID_LICITACAO) {
    sessionStorage.setItem('id_licitacao', ID_LICITACAO);
    window.location.href = 'editarLicitacao.html';
}

function limparModal() {
    $('#tipo_disputa').val(0);
    $('#tipo_disputa').niceSelect('update');
    $('.nice-select').css('width', '519px');
    $('.nice-select').css('height', '46px');

    $('#criterio').val(0);
    $('#criterio').niceSelect('update');
    $('.nice-select').css('width', '519px');
    $('.nice-select').css('height', '46px');

    $('#tempo_lance').val(0);
    $('#tempo_lance').niceSelect('update');
    $('.nice-select').css('width', '519px');
    $('.nice-select').css('height', '46px');

    $('#tempo_menor_lance').val(0);
    $('#tempo_menor_lance').niceSelect('update');
    $('.nice-select').css('width', '519px');
    $('.nice-select').css('height', '46px');

    $('#minimo_lance').val('');
    $('#minimo_menor_lance').val('');
    $('#desc_lote').text('');
    $("#checktratamentoSim").prop("checked", false);
    $("#checktratamentoNao").prop("checked", false);
    $("#checkExclusividadeSim").prop("checked", false);
    $("#checkExclusividadeNao").prop("checked", false);
    $("#checkFornecedorSim").prop("checked", false);
    $("#checkFornecedorNao").prop("checked", false);
}

function showModalLote(action, id_lote) {
    limparModal();
    if (action == 1) {
        $('#btn-modal-lote').attr('onclick', 'validarDadosLote(1)');
    } else if (action == 2) {
        carregarDadosLote(id_lote);
        $('#btn-modal-lote').attr('onclick', 'validarDadosLote(2,' + id_lote + ')');
    }
    $('#modal-default').modal('show');
}

function appendLotes(idHtml, lotes) {

    if (lotes.length > 0) {
        for (var i = 0; i < lotes.length; i++) {
            card_lote = '';
            card_lote = card_lote + '<tr>' +
                '<td>' + lotes[i].ID_LOTE + '</td>' +
                '<td>' +
                '<a onclick="showModalLote(2, ' + lotes[i].ID_LOTE + ')" class="btn btn-default">' +
                '<i class="fa fa-edit"></i>' +
                '</a>' +
                '</td>' +
                '</tr>';
            $(idHtml).append(card_lote);
        }
    }
}


function editarLicitacao() {
    var id_comprador = 0;
    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        id_comprador = dataUser.ID_COMPRADOR;
    }

    var id_licitacao_cliente = 0;
    if (sessionStorage.getItem('id_licitacao_cliente')) {
        id_licitacao_cliente = JSON.parse(sessionStorage.getItem('id_licitacao_cliente'));
    }

    var id_licitacao = 0;
    if (sessionStorage.getItem('id_licitacao')) {
        id_licitacao = JSON.parse(sessionStorage.getItem('id_licitacao'));
    }

    var myFormData = new FormData();
    myFormData.append('idComprador', id_comprador);
    myFormData.append('id_licitacao', id_licitacao);
    myFormData.append('cliente', $("#cliente").val());
    myFormData.append('unidade_organizacional', $("#unidade_organizacional").val());
    myFormData.append('id_licitacao_cliente', id_licitacao_cliente);
    myFormData.append('valor_base', $("#valor_base").val());
    myFormData.append('edital', $("#edital").val());
    myFormData.append('processo', $("#processo").val());
    myFormData.append('modalidade_tipo', $("#modalidade_tipo").val());
    myFormData.append('fornecedor', $("#fornecedor").val());
    myFormData.append('forma_conducao', $("#forma_conducao").val());
    myFormData.append('tipo', $("#tipo").val());
    myFormData.append('moeda', $("#moeda").val());
    myFormData.append('prazo_impugnacao', $("#prazo_impugnacao").val());
    myFormData.append('inicioProposta', $("#inicioProposta").val());
    myFormData.append('aberturaProposta', $("#aberturaProposta").val());
    myFormData.append('dataHoraDisputa', $("#dataHoraDisputa").val());
    myFormData.append('finalDisputa', $("#finalDisputa").val());
    myFormData.append('moedaProposta', $("#moeda_proposta").val());
    myFormData.append('resumo', $("#resumo").val());
    myFormData.append('nacional', $("#nacional").prop("checked"));
    myFormData.append('regional', $("#regional").prop("checked"));
    myFormData.append('aquisicao', $("#aquisicao").prop("checked"));
    myFormData.append('simulacao', $("#simulacao").prop("checked"));

    $('#span-licitacao').text("");
    $('#spinner').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/editarLicitacao',
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
                success(data.response.sucesso.message.message);
                window.location.href = "licitacoes.html";;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

//lote
//Salvar Lote
function validarDadosLote(action,id_lote) {

    if ($("#tipo_disputa").val() == 0) {
        warning('Informe o tipo de disputa!');
        $("#tipo_disputa").focus();
        return false;
    }    

    if ($("#criterio").val() == 0) {
        warning('Informe o critério de seleção!');
        $("#criterio").focus();
        return false;
    }

    if(!$("#checktratamentoSim").prop("checked") && !$("#checktratamentoNao").prop("checked")){
        warning('Selecione ao menos uma opção para tratamento diferenciado para ME/EPP/COOP!');
        $("#checktratamentoSim").focus();
        return false;
    } 

    if(!$("#checkExclusividadeSim").prop("checked") && !$("#checkExclusividadeNao").prop("checked")){
        warning('Selecione ao menos uma opção para exclusividade de participação por ME/EPP/COOP!');
        $("#checkExclusividadeSim").focus();
        return false;
    } 

    if ($("#tempo_lance").val() == 0) {
        warning('Informe o tempo minimo entre lances!');
        $("#tempo_lance").focus();
        return false;
    }  

    if ($("#tempo_menor_lance").val() == 0) {
        warning('Informe o tempo minimo entre o menor lance!');
        $("#tempo_menor_lance").focus();
        return false;
    }    

    if ($("#minimo_lance").val() == '') {
        warning('Informe o valor mínimo entre lances!');
        $("#minimo_lance").focus();
        return false;
    }

    if ($("#minimo_menor_lance").val() == '') {
        warning('Informe o valor mínimo entre menor lance!');
        $("#minimo_menor_lance").focus();
        return false;
    }

    if(!$("#checkFornecedorSim").prop("checked") && !$("#checkFornecedorNao").prop("checked")){
        warning('Selecione ao menos uma opção para a obrigatoriedade da descrição da proposta do fornecedor!');
        $("#checkFornecedorSim").focus();
        return false;
    } 

    if ($("#desc_lote").val() == '') {
        warning('Informe a descrição do lote!');
        $("#desc_lote").focus();
        return false;
    }

    if(action == 1){
        salvarLote();
    } else if(action == 2){
        editarLote(id_lote);
    }
}

function salvarLote() {    
    var id_comprador = 0;
    var id_licitacao = 0;

    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        id_comprador = dataUser.ID_COMPRADOR;
    }

    if (sessionStorage.getItem('id_licitacao')) {
        id_licitacao = JSON.parse(sessionStorage.getItem('id_licitacao'));
    }  

    var myFormData = new FormData();
    myFormData.append('idComprador', id_comprador);
    myFormData.append('id_licitacao', id_licitacao);
    myFormData.append('tipoDisputa', $("#tipo_disputa").val());
    myFormData.append('criterio', $("#criterio").val());
    if($("#checktratamentoSim").prop("checked")){
        myFormData.append('checktratamento', 1);
    } else if($("#checktratamentoNao").prop("checked")){
        myFormData.append('checktratamento', 0);
    }

    if($("#checkExclusividadeSim").prop("checked")){
        myFormData.append('checkExclusividade', 1);
    } else if($("#checkExclusividadeNao").prop("checked")){
        myFormData.append('checkExclusividade', 0);
    }
    myFormData.append('tempoLance', $("#tempo_lance").val());
    myFormData.append('tempoMenorLance', $("#tempo_menor_lance").val());
    myFormData.append('minimoLance', $("#minimo_lance").val());
    myFormData.append('minimoMenorLance', $("#minimo_menor_lance").val());
    if($("#checkFornecedorSim").prop("checked")){
        myFormData.append('checkFornecedor', 1);
    } else if($("#checkFornecedorNao").prop("checked")){
        myFormData.append('checkFornecedor', 0);
    }
    myFormData.append('descLote', $("#desc_lote").val());
           
    $('#span-lote').text("");
    $('#spinner').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/cadastrarLoteLicitacao',
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
                success(data.response.sucesso.message.message);
                location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

//Editar Lote
function carregarDadosLote(id_lote) {    
    var ID_COMPRADOR = 0;
    var id_licitacao = 0;

    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        ID_COMPRADOR = dataUser.ID_COMPRADOR;
    }

    if (sessionStorage.getItem('id_licitacao')) {
        id_licitacao = JSON.parse(sessionStorage.getItem('id_licitacao'));
    }     

    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/dadosLote',
        dataType: "json",
        data: { 
            'idComprador': ID_COMPRADOR,
            'id_licitacao': id_licitacao,
            'id_lote': id_lote
        },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function (data, textStatus, jqXHR) {
            if (data.message) {
                error(data.response.erro.message);
            } else {
                //posteriormente implementar JWT              
                appendDadosLote(data.response.sucesso.message.lote);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}

function appendDadosLote(lote) {
    
    if (lote.length > 0) {
        for (var i = 0; i < lote.length; i++) { 
            $('#numero_licitacao').text('Licitação Nº ' + sessionStorage.getItem('ds_edital'));   

            $('#tipo_disputa').val(lote[i].DS_TIPO_DISPUTA);
            $('#tipo_disputa').niceSelect('update'); 
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');
                    
            $('#criterio').val(lote[i].DS_CRITERIO_SELECAO);
            $('#criterio').niceSelect('update'); 
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');        

            $('#tempo_lance').val(lote[i].DS_TEMPO_LANCE);              
            $('#tempo_lance').niceSelect('update'); 
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');  

            $('#tempo_menor_lance').val(lote[i].DS_TEMPO_MENOR_LANCE);                      
            $('#tempo_menor_lance').niceSelect('update'); 
            $('.nice-select').css('width', '519px');
            $('.nice-select').css('height', '46px');  

            $('#minimo_lance').val(lote[i].VL_MINIMO_LANCE);
            $('#minimo_menor_lance').val(lote[i].VL_MINIMO_MENOR_LANCE);
            $('#desc_lote').text(lote[i].DS_DESCRICAO);

            if(lote[i].DS_TRATAMENTO_MEEPPCOOP == 1){
                $("#checktratamentoSim").prop("checked", true);
            } else if(lote[i].DS_TRATAMENTO_MEEPPCOOP == 0){
                $("#checktratamentoNao").prop("checked", true);
            } 
        
            if(lote[i].DS_EXCLUSIVIDADE_MEEPPCOOP == 1){
                $("#checkExclusividadeSim").prop("checked", true);
            } else if(lote[i].DS_EXCLUSIVIDADE_MEEPPCOOP == 0){
                $("#checkExclusividadeNao").prop("checked", true);
            } 

            if(lote[i].DS_FORNECEDOR_DESC_OBRIGATORIO == 1){
                $("#checkFornecedorSim").prop("checked", true);
            } else if(lote[i].DS_FORNECEDOR_DESC_OBRIGATORIO == 0){
                $("#checkFornecedorNao").prop("checked", true);
            }                     
        }
    }
}

function editarLote(id_lote) {
    var id_comprador = 0;
    var id_licitacao = 0;

    if (sessionStorage.getItem('tend-compr')) {
        var dataUser = JSON.parse(window.atob(sessionStorage.getItem('tend-compr')));
        id_comprador = dataUser.ID_COMPRADOR;
    }

    if (sessionStorage.getItem('id_licitacao')) {
        id_licitacao = JSON.parse(sessionStorage.getItem('id_licitacao'));
    }  

    var myFormData = new FormData();
    myFormData.append('idComprador', id_comprador);
    myFormData.append('id_licitacao', id_licitacao);
    myFormData.append('id_lote', id_lote);
    myFormData.append('tipoDisputa', $("#tipo_disputa").val());
    myFormData.append('criterio', $("#criterio").val());
    if($("#checktratamentoSim").prop("checked")){
        myFormData.append('checktratamento', 1);
    } else if($("#checktratamentoNao").prop("checked")){
        myFormData.append('checktratamento', 0);
    }

    if($("#checkExclusividadeSim").prop("checked")){
        myFormData.append('checkExclusividade', 1);
    } else if($("#checkExclusividadeNao").prop("checked")){
        myFormData.append('checkExclusividade', 0);
    }

    myFormData.append('tempoLance', $("#tempo_lance").val());
    myFormData.append('tempoMenorLance', $("#tempo_menor_lance").val());
    myFormData.append('minimoLance', $("#minimo_lance").val());
    myFormData.append('minimoMenorLance', $("#minimo_menor_lance").val());

    if($("#checkFornecedorSim").prop("checked")){
        myFormData.append('checkFornecedor', 1);
    } else if($("#checkFornecedorNao").prop("checked")){
        myFormData.append('checkFornecedor', 0);
    }

    myFormData.append('descLote', $("#desc_lote").val());
           
    $('#span-licitacao').text("");
    $('#spinner').css('display', 'block');
    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': jQuery('meta[name="csrf-token"]').attr('content') } });
    $.ajax({
        type: "POST",
        url: 'https://testetendering.myappnow.com.br/api/editarLote',
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
                success(data.response.sucesso.message.message);
                location.reload();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //limpar formulario           
            tratarErro(XMLHttpRequest, XMLHttpRequest.responseJSON.response.sucesso.message.message);
        }
    });
}