$(function(){
    if(!UtilityHasTouch()) {
        skrollr.init({
            smoothScrolling: false,
            mobileDeceleration: 0.004
        });
    }

    $(document).on('click', '.scrolltop a', function(event){
        event && event.preventDefault();
        $('html').scrollTo(0, 1000);
    })
        .on('click', '.gallery .thumbs a', function(event){
            event && event.preventDefault();
            var $target = $(event.currentTarget),
                src = $target.prop('href');

            if($target.hasClass('active')) return false;
            $target.closest('.gallery').find('.thumbs a').removeClass('active');
            $target.addClass('active');

            var $bigImg = $target.closest('.gallery').find('.big-image');
            $bigImg.fadeTo(300, 0, function(){
                $(this).prop('src', src);
                $(this).fadeTo(300, 1);
            });

        });
});

function UtilityHasTouch() {
    var agent   = navigator.userAgent;
    if ( agent.match(/(iPhone|iPod|iPad|Blackberry|Android)/) ) {
        return true;
    }
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
}