/**
 * ScrollIt
 * ScrollIt.js(scroll•it•dot•js) makes it easy to make long, vertically scrolling pages.
 *
 * Latest version: https://github.com/cmpolis/scrollIt.js
 *
 * License <https://github.com/cmpolis/scrollIt.js/blob/master/LICENSE.txt>
 */
(function($) {
    'use strict';

    var pluginName = 'ScrollIt',
        pluginVersion = '1.0.3';

    /*
     * OPTIONS
     */
    var defaults = {
        easing: 'linear',
        scrollTime: 600,
        activeClass: 'active',
        onPageChange: null,
        topOffset : 0
    };

    $.scrollIt = function(options) {

        /*
         * DECLARATIONS
         */
        var settings = $.extend(defaults, options),
            active = 0,
            lastIndex = $('[data-scroll-index]:last').attr('data-scroll-index');

        /*
         * METHODS
         */

        /**
         * navigate
         *
         * sets up navigation animation
         */
        var navigate = function(ndx) {
            if(ndx < 0 || ndx > lastIndex) return;

            var targetTop = $('[data-scroll-index=' + ndx + ']').offset().top + settings.topOffset + 1;
            $('html,body').animate({
                scrollTop: targetTop,
                easing: settings.easing
            }, settings.scrollTime);
        };

        /**
         * doScroll
         *
         * runs navigation() when criteria are met
         */
        var doScroll = function (e) {
            var target = $(e.target).closest("[data-scroll-nav]").attr('data-scroll-nav') ||
            $(e.target).closest("[data-scroll-goto]").attr('data-scroll-goto');
            navigate(parseInt(target));
        };



        /**
         * updateActive
         *
         * sets the currently active item
         */
        var updateActive = function(ndx) {
            if(settings.onPageChange && ndx && (active != ndx)) settings.onPageChange(ndx);

            active = ndx;
            $('[data-scroll-nav]').removeClass(settings.activeClass);
            $('[data-scroll-nav=' + ndx + ']').addClass(settings.activeClass);
        };

        /**
         * watchActive
         *
         * watches currently active item and updates accordingly
         */
        var watchActive = function() {
            var winTop = $(window).scrollTop();
            /**
             * upper bound must -4, the active will Work properly
             * -4 is magic number by watch
             */
            var visible = $('[data-scroll-index]').filter(function(ndx, div) {
                return winTop >= $(div).offset().top + settings.topOffset &&
                winTop < $(div).offset().top + (settings.topOffset) + $(div).outerHeight() - 4
            });
            var newActive = visible.first().attr('data-scroll-index');
            updateActive(newActive);
        };

        /*
         * runs methods
         */
        $(window).on('scroll',watchActive).scroll();



        $('body').on('click','[data-scroll-nav], [data-scroll-goto]', function(e){
            e.preventDefault();
            doScroll(e);
        });

    };
}(jQuery));