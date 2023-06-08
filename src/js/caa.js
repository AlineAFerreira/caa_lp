/* ==========================
    Author: Aline Ferreira
    Version: 1.0 
=============================*/

const caa = {
    
	init: function() {

        // $( "header" ).load( "includes/header.html" );
        // $( "footer" ).load( "includes/footer.html" );

        var maskBehavior = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
        options = {onKeyPress: function(val, e, field, options) {
                field.mask(maskBehavior.apply({}, arguments), options);
            }
        };

        $('.phone').mask(maskBehavior, options);

        $.ajaxSetup({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}
        });

        // $('ul.navbar li a').click(function(e) {
        //     var $this = $(this);
        //     $this.closest('ul').find('.active').removeClass('active');
        //     $this.parent().addClass('active');
        //     if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
        //         $('.navbar-collapse.in').collapse('hide');
        //     }
        // });

        $(window).scroll(function() {
            if ($(window).scrollTop() >= 450) { 
                $('#backToTop').addClass('show');
            } else {
                $('#backToTop').removeClass('show');  
            }

            if ($(window).scrollTop() <= 50) {
                $('ul.navbar li:first').addClass('active');
            }
        });

        jQuery.validator.addMethod("validEmail", function(value, element) {
            return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        }, 'E-mail inválido.');

        $("#contact-form").validate({
            rules: {
                name: {
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
                address: {
                    required: true
                },
                plan: {
                    required: true
                }
            },
            messages: {
                name: "Por favor, informe o seu nome.",
                email: {
                    required: "Por favor, informe o seu e-mail.",
                    validEmail: "Por favor, informe um e-mail válido."
                },
                phone: {
                    required: "Por favor, informe o seu telefone.",
                    minlength: "Telefone inválido."
                },
                address: "Por favor, informe seu endereço.",
                plan: "Por favor, escolha um plano."
            },
            submitHandler: function (form) { 
                var msg, addClass = '';
                var form = $(form);
                var url = form.attr('action');
                $.ajax({
                    type: 'POST',
                    url: url,
                    data: form.serialize(),
                    beforeSend: function(data){
                        $('#alertMsg.alert')
                            .addClass('hidden')
                            .removeClass('alert-success')
                            .removeClass('alert-danger');
                        $('#sendForm').text('Enviando...').attr('disabled', true);
                    },
                    
                    success: function(data){
                        console.log('retorno', data);
                        if(data.status){
                            addClass = 'alert-success';
                            msg = 'Mensagem enviada com sucesso!';
                            form[0].reset();
                        } else {
                            addClass = 'alert-danger';
                            msg = 'Ocorreu um erro. Tente novamente mais tarde!';
                        }
                    },

                    complete: function(){
                        $('#sendForm').text('Enviar').attr('disabled', false);
                        $('#alertMsg.alert').removeClass('hidden').addClass(addClass);
                        $('#alertMsg .text').text(msg);
                    }
                });
            }
        });
    },

    backtotop: function() {
        $("html, body").stop().animate({ scrollTop: 0 }, 800);
    },

    runTo: function(target, space, delay) {
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top - space
        }, delay);
    },

    validEmail: function() {
        jQuery.validator.addMethod("validEmail", function(value, element) {
            return this.optional(element) || /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
        }, 'E-mail inválido.');
    }
}
