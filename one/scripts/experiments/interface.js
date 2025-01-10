var p = 0;
var pageLoaded = false;
var webglSupport;

$(window).on('load', function () {
    pageLoaded = true;
});

$(function () {

    webgl.checkSupport();
    popupBlock.init();

    if (webglSupport) {
        menu.init();
    }

});

var webgl = {

    detect: function () {
        try {
            var canvas = document.createElement("canvas");
            return !!
                window.WebGLRenderingContext &&
                (canvas.getContext("webgl") ||
                    canvas.getContext("experimental-webgl"));
        } catch (e) {
            return false;
        }
    },

    checkSupport: function () {
        if (!webgl.detect()) {
            webglSupport = false;
            webgl.onError();
        } else {
            webglSupport = true;
        }
    },

    onError: function () {
        if (!webglSupport) {
            $('.errorNotice').show();
        }
    }
}

var loader = {

    init: function () {
        setTimeout(function () {
            loader.update();
        }, 4000);
    },

    update: function () {
        if (p < 100) {
            if (!pageLoaded) {

                var remaining = 100 - p;
                var addRandom = Math.floor(Math.random() * 10 / 100 * remaining);
                if (p < 95) {
                    if (p + addRandom < 100) {
                        p += addRandom;
                    } else {
                        p = 100;
                    }
                }
                setTimeout('loader.update()', 200);

            } else {

                /*
                var addRandom = Math.floor(Math.random() * 30);
                if (p + addRandom < 100) {
                    p += addRandom;
                } else {
                    p = 100;
                }
                */
                p = 100;
                setTimeout('loader.update()', 200);

            }

        } else {
            setTimeout(function () {
                $("body").addClass('loaded');
            }, 2000);
        }

        $('.loadingStatus span').text(p + '%');
        $(".layer.third .clip").css("width", p + "%");
    }

}

loader.init();

var popupBlock = {

    init: function () {
        popupBlock.clicks();
        popupBlock.onPageLoad();
    },

    clicks: function () {
        $('.row.top .textBlock .close').on('click', function () {
            $(this).parent().addClass('hide');
            cookie.create('closedPopup', 'true');
            $('.playButton').fadeIn(300);
        });
    },

    onPageLoad: function () {
        if (cookie.read('closedPopup') == 'true' || !webglSupport) {
            $('.row.top .textBlock').hide(0);
        }
    }

}


var cookie = {
    create: function (name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    },

    read: function (c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
}

var menu = {

    init: function () {
        menu.clicks();
    },

    clicks: function () {
    	$('div.menu div.menuButton').on('click', function () {
    		if ($('div.menu').hasClass('open')) {
    			menu.close();
    		} else {
    			menu.open();
    		}
    	});
    },

    open: function () {
    	$('div.menu').addClass('open');
    },

    close: function () {
    	$('div.menu').removeClass('open');
    }
}