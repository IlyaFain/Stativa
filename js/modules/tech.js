$(function(){

    (function InitFrames(){

        var framesLength = $('.page-frame').length;

        // Init nav control position and contents
        $('.page-frame').each(function(key, item){
            var $nav = $(item).find('.nav'),
                left = parseInt($nav.css('left')) - 44 * key - 16 * key, // Menu point width + gutter
                contents = '';
            $nav.css('left', left + 'px');

            // Generate nav links
            $nav.empty();
            for(var i = 1; i <= framesLength; i++) {
                contents += '<a data-hash="frame' + i + '" href="#frame' + i + '" ' + (i == key + 1 ? 'class="selected"' : '') + ' data-goto="' + i + '">' + i + '</a>'
            }
            $nav.html(contents);
        });

        // Init nav control
        $(document).on('click', '.nav a', function(event) {
            event && event.preventDefault();
            var $target = $(event.currentTarget),
                frameNum = $target.data('goto');

            Frame.setFrame(frameNum);
        });

        // Hide menu points
        setTimeout(function(){ $('.nav').removeClass('active'); }, 2000);

        // Init scroll spy
        $('.page-frame').each(function(i) {
            var position = $(this).position();
            $(this).scrollspy({
                min: position.top - 100 - (i == 5 ? 200 : 0),
                max: position.top + $(this).height() - (i == 4 ? 200 : 0),
                onEnter: function(element, position) {
                    Frame.enter($(element).data('frame'));
                },
                onLeave: function(element, position) {
                    Frame.leave($(element).data('frame'));
                }
            });
        });

    })();

    // Init frames backgrounds
    setTimeout(
        function() {
            var html = '';
            $('.backgrounds-inner-wrapper .js-box').remove();
            $('.page-frame').each(function(){
                var $frame = $(this),
                    $frameContent = $frame.find('.frame-content'),
                    $frameQuote = $frame.find('.frame-quote');

                html += '<div class="js-box frame-background" style="height: ' + $frameContent.outerHeight() + 'px;"></div>';
                html += '<div class="js-box frame-quote-background" style="height: ' + $frameQuote.outerHeight() + 'px;"></div>';
            });

            $('.backgrounds-inner-wrapper').append(html);
        }
    , 100);

    // Init scroll reaction (fill backgrounds and lines)
    $(window).scroll(function(){
        var scrollTop = $(window).scrollTop();
        $('.backgrounds-inner-wrapper').css('top', '-' + scrollTop + 'px');
    });

    // Catch page hash and show frame
    (function InitStartingFrame(){
        if(window.location.hash) {
            var frameNum = window.location.hash.replace(/#frame/gi, '');
            Frame.setFrame(frameNum);
        }
    })();
});

var Frame = {
    currentFrame: null,
    minClipHeight: 492,
    scrollToDelay: 500,

    enter: function(id) {
        var _this = this,
            $frame = $('[data-frame="' + id + '"]');
        $frame.find('.frame-graphics').addClass('active');
        _this.currentFrame = id;
        window.location.hash = 'frame' + id;
//        _this.setClipHeight($('[data-frame="' + id + '"]'));

    },
    leave: function(id) {
        var _this = this,
            $frame = $('[data-frame="' + id + '"]');
        this.currentFrame = null;
        $frame.find('.frame-graphics').removeClass('active');
    },
    setClipHeight: function($frame) {
        var frameHeight = $frame.outerHeight() < this.minClipHeight ? this.minClipHeight : $frame.outerHeight();

        if($frame.data('frame') == $('[data-frame]').length) {
            frameHeight += $frame[0].getBoundingClientRect().top;
        }
        $('.backgrounds-outer-wrapper').css({
            clip: 'rect(0px, 10000px, ' + frameHeight + 'px, 0px)'
        });
    },
    setFrame: function(id) {
        $('html').scrollTo($('[data-frame="' + id + '"]'), this.scrollToDelay);
    }
}
