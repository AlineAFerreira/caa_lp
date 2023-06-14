/* ==========================
    Author: Aline Ferreira
    Version: 1.0 
=============================*/

const caa = {
  SELECTED_PLAN: null,
  init: function () {
    const maskPhone = function (val) {
        return val.replace(/\D/g, '').length === 11
          ? '(00) 00000-0000'
          : '(00) 0000-00009';
      },
      options = {
        onKeyPress: function (val, e, field, options) {
          field.mask(maskPhone.apply({}, arguments), options);
        }
      };

    $('#phone').mask(maskPhone, options);
    $('#cpf').mask('000.000.000-00');
    $('#birthdate').mask('00/00/0000');

    $.ajaxSetup({
      headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
    });

    $(window).scroll(function () {
      if ($(window).scrollTop() >= 450) {
        $('#backToTop').addClass('show');
      } else {
        $('#backToTop').removeClass('show');
      }

      if ($(window).scrollTop() <= 50) {
        $('ul.navbar li:first').addClass('active');
      }
    });

    jQuery.validator.addMethod(
      'validEmail',
      function (value, element) {
        return (
          this.optional(element) ||
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          )
        );
      },
      'E-mail inválido.'
    );

    $.validator.addMethod(
      'validateBirthdate',
      function (value, element) {
        if (value.length != 10) return false;

        let date = value.split('/');
        let dia = parseInt(date[0]);
        let mes = parseInt(date[1]);
        let ano = parseInt(date[2]);
        if (new Date().getFullYear() - ano < 18 || new Date().getFullYear() - ano > 120)
          return false;

        if (dia > 31 || dia == 0) return false;

        if (mes > 12 || mes == 0) return false;

        if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30) return false;

        if (mes == 2 && dia > 29) return false;

        if (
          (!(ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0) &&
          mes == 2 &&
          dia >= 29
        )
          return false;

        return true;
      },
      'Data inválida'
    );

    $.validator.addMethod(
      'validCpf',
      (value, element) => {
        cpf = value.replace(/\D/g, '');

        // Verificar se o CPF possui 11 dígitos
        if (cpf.length !== 11) {
          return false;
        }

        // Verificar se todos os dígitos são iguais (ex: 111.111.111-11)
        if (/^(\d)\1+$/.test(cpf)) {
          return false;
        }
        // Calcular o primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
          soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

        // Calcular o segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
          soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

        // Verificar se os dígitos verificadores estão corretos
        return (
          digitoVerificador1 === parseInt(cpf.charAt(9)) &&
          digitoVerificador2 === parseInt(cpf.charAt(10))
        );
      },
      'CPF inválido'
    );

    $('#contact-form').validate({
      rules: {
        name: {
          required: true
        },
        lastname: {
          required: true
        },
        email: {
          required: true,
          validEmail: true
        },
        phone: {
          required: true,
          minlength: 14
        },
        cpf: {
          required: true,
          rangelength: [14, 14],
          validCpf: true
        },
        birthdate: {
          required: true,
          minlength: 10,
          validateBirthdate: true
        },
        creci: {
          required: true
        },
        profile: {
          required: true
        }
      },
      messages: {
        name: 'Campo obrigatório',
        lastname: 'Campo obrigatório',
        email: {
          required: 'Campo obrigatório',
          validEmail: 'E-mail inválido'
        },
        phone: {
          required: 'Campo obrigatório',
          minlength: 'Telefone inválido'
        },
        cpf: {
          required: 'Campo obrigatório',
          rangelength: 'CPF inválido'
        },
        birthdate: {
          required: 'Campo obrigatório',
          minlength: 'Data inválida'
        },
        creci: 'Campo obrigatório',
        profile: 'Campo obrigatório'
      },
      showErrors: function (errorMap, errorList) {
        $.each(errorMap, function (key, value) {
          const parent = $(`[name=${key}]`).parent();
          parent.addClass('has-error');
          parent.find('span.error-message').text(value);
        });
      },
      submitHandler: function (form) {
        $('#btn-send').attr('disabled', true).text('Enviando...');
        const url =
          'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8';

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        const urlencoded = new URLSearchParams();
        urlencoded.append('first_name', $('#name').val());
        urlencoded.append('last_name', $('#lastname').val());
        urlencoded.append('email', $('#email').val());
        urlencoded.append('phone', $('#phone').val());
        urlencoded.append('00NHY000000PuXY', $('#creci').val());
        urlencoded.append('00NHY000000PuXT', $('#cpf').val());
        urlencoded.append('00NHY000000Pv5u', $('#birthdate').val());
        urlencoded.append('00NHY000000PuXd', $('#profile_type').val());
        urlencoded.append('oid', '00D5e000001O9od');
        urlencoded.append('lead_source', 'Web');
        if (caa.SELECTED_PLAN) {
          urlencoded.append('00NHY000000Pv5p', caa.SELECTED_PLAN);
        }

        const requestOptions = {
          method: 'POST',
          headers: headers,
          body: urlencoded,
          mode: 'no-cors'
        };

        fetch(url, requestOptions)
          .then(response => response.text())
          .then(data => alert('Enviado com sucesso!', data))
          .catch(error => {
            alert('Error', error);
          })
          .finally(() => {
            $('#btn-send').attr('disabled', false).text('Enviar dados');
          });
      }
    });

    $('#contact-form input').on('change', function () {
      if ($(this).valid()) {
        $(this).parent().removeClass('has-error');
      }
    });

    $('.select_wrap').click(function () {
      $(this).toggleClass('active');
    });

    $('.select_ul li').click(function () {
      var currentele = $(this).html();

      $('.default_option li').html(currentele);
      $('.select_ul li').removeClass('active');
      $('.wrapper-select').addClass('has-value').removeClass('has-error');
      $('#profile_type').val($('#selected div p').text());
      caa.checkValidation();
    });

    $(document).on('click', function (event) {
      var $target = $(event.target);
      if (!$target.closest('.wrapper-select').length) {
        $('.select_wrap').removeClass('active');
      }
    });

    $('#creci').on('keydown', function (e) {
      if (e.which === 9) {
        $('.select_wrap').focus().addClass('active');
      }
    });
  },

  checkValidation: function () {
    if ($('#contact-form').valid()) {
      $('#btn-send').prop('disabled', false);
    } else {
      $('#btn-send').prop('disabled', 'disabled');
    }
  },

  backtotop: function () {
    $('html, body').stop().animate({ scrollTop: 0 }, 800);
  },

  runTo: function (target, space, delay) {
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: $(target).offset().top - space
        },
        delay
      );
  },

  handleChange: elem => {
    elem.value ? elem.classList.add('has-value') : elem.classList.remove('has-value');
  },

  handleSelectedPlan: (e, obj) => {
    const parent = $(e).parent();
    $('.plan-card:not(#' + parent.attr('id') + ')').removeClass('active');

    if (parent.hasClass('active')) {
      parent.removeClass('active');
      caa.SELECTED_PLAN = null;
    } else {
      parent.addClass('active');
      caa.SELECTED_PLAN = obj.name;
      caa.runTo('#subscribe', -60, 500);
    }
  }
};
