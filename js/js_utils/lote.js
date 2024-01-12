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