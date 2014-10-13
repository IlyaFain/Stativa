var cityTemp = [],
    currentCity = -1,
    lightsInterval,
    gateOpen;

(function LoadCityData(){
    $.ajax({
        url: 'sootvetstvie-temperatur-i-gorodov.html',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            cityTemp = data;
            setNextCity();
        },
        error: function(xhrObj) {
            console.log(xhrObj.status, xhrObj.statusText);
        }
    })
})();


$(function(){
    $('.equalizer').liEqualizer({
        row: 21,
        col: 12,
        speed: 10,
        freq: 200,
        on: false
    });
    $('.play').click(function(){
        var audio = $('#audio')[0];
        if(!audio.paused) {
            $('.equalizer').liEqualizer('stop');
            audio.pause();
            $(this).removeClass('stop');
        } else {
            $('.equalizer').liEqualizer('start');
            audio.play();
            $(this).addClass('stop');
        }
        return false;
    });

    $('#audio').bind("ended", function(){
        $('.equalizer').liEqualizer('stop');
    });

    $('.lights-switch').on('click', function(event){
        event && event.preventDefault();
        $(this).toggleClass('off');
        $('.lamp').toggleClass('off');
        $('.light-frame').toggleClass('off');
    });

    $('.climate-control').on('click', function(event){
        event && event.preventDefault();
        setNextCity();
    });

    // Catch page hash and show frame
    (function InitStartingFrame(){
        setTimeout(function(){
            if(window.location.hash) {
                var frameHash = window.location.hash;
                $('html').scrollTo($('[data-hashtag="' + frameHash + '"]'));
            }
        }, 500);
    })();

    $(document).scroll(function(){
        var limit = Math.max( document.body.scrollHeight - document.documentElement.clientHeight );
        if(limit - $('body').scrollTop() < 500) {
            if(!gateOpen) {
                $('.gate').animate({'top': '-100%'}, 1000);
                gateOpen = true;
            }
        }
    });

    // Init scroll spy
    $('.frame').each(function(i) {
        var position = $(this).position();
        $(this).scrollspy({
            min: position.top - 200,
            max: position.top + $(this).height(),
            onEnter: function(element, position) {
                setHashTag(element);

                // Open auto gate
                if($(element).hasClass('auto-frame')) {
                    if(!gateOpen) {
                        $(element).find('.gate').animate({'top': '-100%'}, 1000);
                        gateOpen = true;
                    }
                }

                // Show rooms lights
                if($(element).hasClass('interface-frame') && !lightsInterval) {
                    lightsInterval = setInterval(function(){
                        var $current = $(element).find('.room.active'),
                            $next = $(element).find('[data-lights]:first');
                        if($current.length && $current.nextAll('[data-lights]:first').length) {
                            $next = $current.nextAll('[data-lights]:first');
                        }

                        $next.addClass('active');
                        $(element).find('.' + $next.data('lights')).fadeIn();
                        $(element).find('.rooms-condition [data-name="' + $next.data('name') + '"] span').html('включен');

                        if($current.length) {
                            $current.removeClass('active');
                            $(element).find('.' + $current.data('lights')).fadeOut();
                            $(element).find('.rooms-condition [data-name="' + $current.data('name') + '"] span').html('выключен');
                        }
                    }, 3000);
                }

                // Security show
                if($(element).hasClass('security-frame')) {
                    $(element).find('.password span:hidden:first').fadeIn('slow', function(){
                        $(element).find('.password span:hidden:first').fadeIn('slow', function(){
                            $(element).find('.password span:hidden:first').fadeIn('slow', function(){
                                $(element).find('.password span:hidden:first').fadeIn('slow', function(){
                                    $(element).find('.password span:hidden:first').fadeIn('slow', function(){
                                        $(element).find('.password span:hidden:first').fadeIn('slow', function(){
                                            $(element).find('.alert').fadeIn('slow', function(){});
                                        });
                                    });
                                });
                            });
                        });
                    });
                }
            },
            onLeave: function(element, position) {
            }
        });
    });
});

function setHashTag(element) {
    var $block = $(element),
        hash = $block.data('hashtag');

    if(hash) {
        window.location.hash = hash;
    }
}

function setNextCity() {
    var backgrounds = [
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(247, 225, 130))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(229, 247, 130))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(200, 247, 130))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(180, 247, 130))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 247, 147))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 247, 204))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 234, 247))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 213, 247))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 200, 247))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 190, 247))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 180, 247))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 175, 247))',
        'linear-gradient(90deg, rgb(247, 244, 223), rgb(130, 170, 247))'
    ];
    if(currentCity == -1) {
        currentCity = 0;
    } else if(currentCity != cityTemp.length - 1) {
        currentCity++;
    } else {
        currentCity = 0;
    }

    var current = cityTemp[currentCity];
    $('.climate-control span').html(current.temp + '&deg;');
    $('.climate-control .bubble').html(current.text + ' ' + current.temp + '&deg;');
    $('.climate-frame').css('background-image', backgrounds[currentCity]);
}

function checkClimate(nodeData) {
    var values = cityTemp;

    if(values.length && nodeData && nodeData[1] >= values[0].start && nodeData[1] <= values[values.length-1].start) {
        var current;
        $.each(values, function(key, value){
            if(value.start == nodeData[1]) current = value;
        });
        $('.climate-control span').html(current.temp + '&deg;');
        $('.climate-control .bubble').html(current.text + ' ' + current.temp + '&deg;');
    }
}

/*код плагина*/
(function ($) {
    var methods = {
        init: function (options) {
            var p = {
                row:10,			//кол-во столбцов
                col:8,			//кол-во колонок
                speed:20,		//скорость подсветки кубиков
                freq:400,		//частота сигнала
                on:true			//включено по умолчанию (true,false)
            };
            if (options) {
                $.extend(p, options);
            }
            var eqWrap = $(this).addClass('eqWrap');
            for(c=0;c<p.col;c++){
                var eqColEl = $('<div>').addClass('eqCol').appendTo(eqWrap);
                for(r=0;r<p.row;r++){
                    $('<div>').addClass('eqItem').appendTo(eqColEl);
                }
            }
            var
                eqCol = $('.eqCol',eqWrap),
                eqItem = $('.eqItem',eqWrap),
                randomNumber = function (m,n){
                    m = parseInt(m);
                    n = parseInt(n);
                    return Math.floor( Math.random() * (n - m + 1) ) + m;
                },
                eqUp = function(colEl,val){
                    var
                        speed = p.speed,
                        v = p.row - val,
                        i=p.row,
                        j=0,
                        flag2=true,
                        eachItemUp = function(){
                            $('.eqItem',colEl).eq(i-1).nextAll().stop().css({opacity:'1'});
                            if($('.eqItem',colEl).eq(i-1).css('opacity') == 1){
                                flag2 = false
                            }else{
                                flag2 = true
                            }
                            $('.eqItem',colEl).eq(i-1).stop(true).animate({opacity:'1'},p.speed,function(){
                                if($('.eqItem',colEl).index(this) == v){
                                    if(flag2){
                                        eqDown(colEl,val);
                                    }
                                }else{
                                    i--;
                                    j++;
                                    if(i>v){
                                        eachItemUp()
                                    }
                                }
                            })

                        }
                    eachItemUp()
                },
                eqDown = function(colEl,val){
                    var
                        v = p.row - val,
                        i = (p.row-val),
                        j = 0,
                        speed = p.speed*2,
                        eachItemDown = function(){
                            if(i == (p.row-val)){
                                $('.eqItem',colEl).eq(i).animate({opacity:'0'},speed*10)
                                setTimeout(function(){
                                    i++;
                                    j++;
                                    if(i<p.row){
                                        eachItemDown();
                                    }
                                },speed)
                            }else{
                                $('.eqItem',colEl).eq(i).animate({opacity:'0'},speed,function(){
                                    i++;
                                    j++;
                                    if(i<p.row){
                                        eachItemDown();
                                    }
                                })
                            }
                        }
                    eachItemDown();
                },
                eqInterval = function(){
                    eqCol.each(function(){
                        eqUp($(this),randomNumber(0,p.row))
                    })
                }
            eqInterval()
            if(p.on){
                var eqIntervalId = setInterval(eqInterval,p.freq)
                $(this).data({
                    'eqIntId':eqIntervalId,
                    'eqInt':eqInterval,
                    'freq':p.freq,
                    'on':p.on
                })
            }else{
                $(this).data({
                    'eqIntId':eqIntervalId,
                    'eqInt':eqInterval,
                    'freq':p.freq,
                    'on':p.on
                })
            }
        },start: function () {
            if(!$(this).data('on')){
                $(this).data('eqInt')();
                var eqIntervalId = setInterval($(this).data('eqInt'),$(this).data('freq'));
                $(this).data({
                    'eqIntId':eqIntervalId,
                    'on':true
                })
            }
        },
        stop: function () {
            if($(this).data('on')){
                clearInterval($(this).data('eqIntId'));
                $('.eqItem',$(this)).animate({opacity:0})
                $(this).data({
                    'on':false
                })
            }
        }
    };
    $.fn.liEqualizer = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Метод ' + method + ' в jQuery.liEqualizer не существует');
        }
    };
})(jQuery);