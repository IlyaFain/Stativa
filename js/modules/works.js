$(function(){
    $('.work-slider').each(function(){
        var $slider = $(this),
            $next = $slider.siblings('.work-slider-next'),
            $prev = $slider.siblings('.work-slider-prev'),
            carousel = $slider.jcarousel({
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
});