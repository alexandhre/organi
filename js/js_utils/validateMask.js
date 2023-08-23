$(document).ready(function ($) {
        $('#cnpj').mask('00.000.000/0000-00', { reverse: true });
        $('#cpf').mask('000.000.000-00', { reverse: true });
        $('#telefone').mask('(99) 99999-9999');
        $('#telefoneComercial').mask('(99) 9999-9999');
        $('#dt_fundacao').mask('00/00/0000', { reverse: true });
        $('#dt_nasc_representante').mask('00/00/0000', { reverse: true });
        $('#RGRepresentanteLegal').mask('99.999.999-99', { reverse: true });
        $('#CPFRepresentante').mask('999.999.999-999', { reverse: true });
        $('#cep').mask('00000-000', { reverse: true });  
        //$('#qtdEmpregados').mask('000000000000000000000000000000', { reverse: true });  
        //$('#dt_inicio').mask('00/00/0000', { reverse: true });  
        //$('#dt_fim').mask('00/00/0000', { reverse: true });              
});