$(function(){
    var topOff;

    $("input.js-uniform-checkbox").uniform();
    $("input.js-phone-mask").mask("+7 (999) 999-99-99");

    $(".example-popup").dialog({
        autoOpen: false,
        resizable: false,
        modal: false,
        draggable: false,
        width: 590,
        position: { my: "center top", at: "center bottom+20", of: $('.examples'), collision: "none" },
        closeOnEscape: true,
        open: function( event, ui ) {
            var blockId = $(this).prop('id');
            $(this).parent().promise().done(function () {
                $('.js-example-popup[data-example="' + blockId + '"]').addClass('active');
                $(window).scrollTop(topOff);
            });
        },
        close: function( event, ui ) {
            var blockId = $(this).prop('id');
            $('.js-example-popup[data-example="' + blockId + '"]').removeClass('active');
        }
    });

    $(document).on('click', '.js-example-popup', function(event){
        event && event.preventDefault();
        var $target = $(event.currentTarget),
            blockId = $target.data('example'),
            $block = $('#' + blockId);

        topOff = $(window).scrollTop();
        if(!$block.length) {
            throw new Error("Popup block " + blockId + " not found!");
        }

        if($block.dialog("isOpen")) {
            $block.dialog("close");
        } else {
            $(".example-popup").dialog("close");
            $block.dialog("open");
        }
    })
        .on('click', '.js-close-popup', function(event){
            event && event.preventDefault();
            var $target = $(event.currentTarget);
            $target.parents('.example-popup').dialog("close");
        });


    $('.slider').each(function(){
        var $slider = $(this),
            $next = $slider.siblings('.slider-next'),
            $prev = $slider.siblings('.slider-prev'),
            carousel = $slider.jcarousel({
                list: '.slider-list',
                items: '.slider-item',
                wrap: 'both'
            });

        $prev.jcarouselControl({
            target: '-=1',
            carousel: carousel
        });
        $next.jcarouselControl({
            target: '+=1',
            carousel: carousel
        });
    });

    $(document).on('change', '.js-options', function(event){
        var options = [];
        $('.js-options').each(function(){
            if($(this).is(':checked')) {
                options.push($(this).data('value'));
            }
        });

        $('.js-hidden-options').val(options.join(','));
    });

    /* Валидация */
    (function ValidateById()
    {
        var $form = $('form.js-validate-price');

        $form.validate(
            {
                debug: true,

                rules:
                {
                    f_Phone: { required: true },
                    f_Name: { required: true }
                },
                messages:
                {
                    f_Phone: { required: "" },
                    f_Name: { required: "" }
                },

                submitHandler: function(form)
                {
                    $.ajax(
                        {
                            url: $form.attr("action"),
                            data: $form.serialize(),
                            method: "POST",
                            success: function(data)
                            {
                                $form.find('input[type=submit]').remove();
                                $('.form-wrapper').append(data);

                            },
                            error: function(data)
                            {
                                alert("Ошибка: " + data.status + ' ' + data.statusText);
                            }
                        });

                    return false;
                }
            });
    })();


});