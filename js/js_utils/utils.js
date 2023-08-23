function validarEmail(email) {

        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (!reg.test(email)) {
                warning('Email Inválido!');
                $("#email").focus();
                return false;
        }
        return true;
}

function validarTamanhoSenha(senha) {

        // if (senha.length < 8) {
        //     warning('Senha Inválida!');
        //     $("#senha").focus();
        //     return false;
        // }
        return true;
}

function validarSenhas(senha, confirmarSenha) {

        if (confirmarSenha != '' && senha != confirmarSenha) {
                warning('Senhas não conferem!');
                $("#senha").focus();
                return false;
        }
        return true;
}

function validarTermoDeUso(IN_TERMOS) {

        if (!IN_TERMOS) {
                warning('Para continuar leia e aceite os termos de uso!');
                $("#termos").focus();
                return false;
        }
        return true;
}

/**
 * Tratar retorno API
 */
function tratarErro(jqXHR, message) {

        if (JSON.stringify(jqXHR.status) === 0) {
                error('Não conectado. Por favor, verifique sua conexão com a rede/internet.');
        } else if (JSON.stringify(jqXHR.status) == 400) {
                error(message);
        } else if (JSON.stringify(jqXHR.status) == 401) {
                error('Sua sessão expirou. faça login novamente para continuar.');
                sessionStorage.clear();
                setTimeout(() => {
                        window.location.href = "login.html";
                }, "3000");                
        } else if (JSON.stringify(jqXHR.status) == 404) {
                error('Erro 404 - Serviço não encontrado. Caso o problema persistir solicite ajuda ao administrador do sistema.');
        } else if (JSON.stringify(jqXHR.status) == 500) {
                error('Erro 500 (Internal Server Error). Caso o problema persistir solicite ajuda ao administrador do sistema.');
        } else if (JSON.stringify(jqXHR.statusText) === 'parsererror') {
                error('A análise JSON solicitada falhou. Caso o problema persistir solicite ajuda ao administrador do sistema.');
        } else if (JSON.stringify(jqXHR.statusText) === 'timeout') {
                error('Time out error. Caso o problema persistir solicite ajuda ao administrador do sistema.');
        } else if (JSON.stringify(jqXHR.statusText) === 'abort') {
                error('Ajax request aborted. Caso o problema persistir solicite ajuda ao administrador do sistema.');
        } else {
                error('Ocorreu um erro interno no Servidor Web Caso o problema persistir solicite ajuda ao administrador do sistema. \n' + JSON.stringify(jqXHR.statusText));
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
                        card_pagination = card_pagination + '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>';
                        $(idHtml).append(card_pagination);
                } else if ((parseFloat(currentPage) == 1 || parseFloat(currentPage) == 2) && pagination.last_page == 2) {
                        card_pagination = '';
                        card_pagination = card_pagination + '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>' +
                                '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(2)">2</a>';
                        $(idHtml).append(card_pagination);
                }
        } else if (parseFloat(currentPage) >= 1) {
                if (parseFloat(currentPage) == pagination.last_page) {
                        if (parseFloat(currentPage) == pagination.last_page) {
                                currentPage = pagination.last_page;
                        }
                        card_pagination = '';
                        card_pagination = card_pagination + '<a id="page_' + (parseFloat(pagination.last_page) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(pagination.last_page) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                                '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>' +
                                '<a style="cursor: pointer;">...</a>' +
                                '<a id="page_' + (parseFloat(currentPage) - 2) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 2) + ')">' + (parseFloat(currentPage) - 2) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>';
                        $(idHtml).append(card_pagination);
                } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 2)) {
                        card_pagination = '';
                        card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                                '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>' +
                                '<a style="cursor: pointer;">...</a>' +
                                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
                        $(idHtml).append(card_pagination);
                } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 1)) {
                        card_pagination = '';
                        card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                                '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>' +
                                '<a style="cursor: pointer;">...</a>' +
                                '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 1) + ')">' + (parseFloat(currentPage) - 1) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
                        $(idHtml).append(card_pagination);
                } else if (parseFloat(currentPage) == (parseFloat(pagination.last_page) - 3)) {
                        card_pagination = '';
                        card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                                '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>' +
                                '<a style="cursor: pointer;">...</a>' +
                                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 3) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 3) + ')">' + (parseFloat(currentPage) + 3) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
                        $(idHtml).append(card_pagination);
                } else if (parseFloat(currentPage) == 2) {
                        card_pagination = '';
                        card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>' +
                                '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>' +
                                '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                                '<a style="cursor: pointer;">...</a>' +
                                '<a id="page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
                        $(idHtml).append(card_pagination);
                } else {
                        card_pagination = '';
                        card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage) - 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) - 1) + ')"><i class="fa fa-long-arrow-left"></i></a>';
                        if (currentPage > 2) {
                                card_pagination = card_pagination + '<a id="page_1"style="cursor: pointer;" onclick="carregarAnunciosProdutos(1)">1</a>' +
                                        '<a style="cursor: pointer;">...</a>';
                        }
                        card_pagination = card_pagination + '<a id="page_' + (parseFloat(currentPage)) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + parseFloat(currentPage) + ')">' + parseFloat(currentPage) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')">' + (parseFloat(currentPage) + 1) + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 2) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 2) + ')">' + (parseFloat(currentPage) + 2) + '</a>' +
                                '<a style="cursor: pointer;">...</a>' +
                                '<a id="page_' + (pagination.last_page) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (pagination.last_page) + ')">' + pagination.last_page + '</a>' +
                                '<a id="page_' + (parseFloat(currentPage) + 1) + '" style="cursor: pointer;" onclick="carregarAnunciosProdutos(' + (parseFloat(currentPage) + 1) + ')"><i class="fa fa-long-arrow-right"></i></a>';
                        $(idHtml).append(card_pagination);
                }
        }
        $("#page_" + currentPage).css('background', '#7fad39');
        $("#page_" + currentPage).css('border-color', '#7fad39');
        $("#page_" + currentPage).css('color', '#ffffff');      
}