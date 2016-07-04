// helper functions

// takes #,#,# and converts to RRGGBB
function backToHex(color) {
    var exploded = color.split(',');
    var hexColor = '', singleColor = '';
    for (var i = 0; i < 3; i++) {
        singleColor = parseInt(exploded[i], 10).toString(16);
        hexColor += (singleColor.length === 1) ? '0' : '';
        hexColor += singleColor;
    }
    return hexColor;
}

// takes #,#,#,# and makes sure it is within 0-255 / 0-1
function realityCheck(color) {
    var exploded = color.split(',');
    for (var i = 0; i < 3; i++) {
        exploded[i] = Math.max(0, Math.min(255, exploded[i]));
    }
    exploded[3] = Math.max(0, Math.min(1, exploded[3]));
    return exploded.toString();
}

// takes two strings of the form "r,g,b,a" and blends the colors. Assumes the alpha of the lower color is 1, so must be called in appropriate order: lower two layers and then that result with top layer.
function blendDownOne(upperColor, lowerColor) {
    var upperExploded = upperColor.split(','),
        lowerExploded = lowerColor.split(','),
        mergedExploded = [];
    // premultiply the alpha of the upper color and merge with the lower
    for (var i = 0; i < 3; i++) {
        upperExploded[i] = upperExploded[i] * upperExploded[3];
        mergedExploded[i] = (1 - upperExploded[3]) * lowerExploded[i] + upperExploded[i];
    }
    // returns string of the form "r,g,b,1" where 0<=r,g,b<=255 (if either alpha is 1, the merge is, and lower alpha is 1 by assumption).
    mergedExploded[3] = 1;
    return mergedExploded.toString();
}

// everything below happens within the AJAX command,
// as something to do after load completes.
// hey, I can use jQuery AJAX in this one!

(function ($) {
    // reaction functions

    function computeAndPreview() {
        // fills colors into preview panel
        // computes blended color values and fills them in to table below
        var currentPickerColor;
        for (var i = 1; i <= 6; i++) {
            currentPickerColor = $('#colorInput-' + i).spectrum("get").toRgbString();
            $('#colorPreview-' + i).css('background', currentPickerColor);
        }
        $("#overlayPreview-w").css("background", "rgba(255,255,255," + parseFloat($('#white-opacity').val()) + ")");
        $("#overlayPreview-b").css("background", "rgba(0,0,0," + parseFloat($('#black-opacity').val()) + ")");
        var mainColors = [],
            whiteColor = realityCheck($("#overlayPreview-w").css("backgroundColor").slice(5, -1)),
            blackColor = realityCheck($("#overlayPreview-b").css("backgroundColor").slice(5, -1)),
            overlayColor = $("#colorPreview-6").css("backgroundColor").slice(5, -1);
        for (i = 1; i < 6; i++) {
            mainColors[i] = $('#colorPreview-' + i).css('backgroundColor').slice(4, -1);
        }
        // row 1 output
        for (i = 1; i < 6; i++) {
            $('#r1c' + i).text("#" + backToHex(blendDownOne(overlayColor, blendDownOne(whiteColor, mainColors[i]))));
            $('#r2c' + i).text("#" + backToHex(blendDownOne(overlayColor, mainColors[i])));
            $('#r3c' + i).text("#" + backToHex(blendDownOne(overlayColor, blendDownOne(blackColor, mainColors[i]))));
        }
    }
    
    function palettePreview() {
        var count = 1;
        $('.small-colorbox').css("background-color", "transparent");
        for (var i = 1; i < 4; i++) {
            for (var j = 1; j < 6; j++) {
                var r = i.toString(), c = j.toString();
                if( $("#colorBox-"+r+c).hasClass('selectedBox') ) {
                    if (count <= 5) {
                        $("#r"+r+"c"+c).css("background-color", $("#r"+r+"c"+c).text());
                        $('.color-'+count.toString()+'-preview').css("background-color", $("#r"+r+"c"+c).text());
                        count++;
                    }
                } else {
                    $("#r"+r+"c"+c).css("background-color", "transparent");
                }
            }
        }
    }
    
    var container = document.getElementById('csp-container'),
        path,
        xhr = new XMLHttpRequest();
    if (container.hasAttribute('data-path')) {
        path = container.getAttribute('data-path');
    } else {
        path = '';
    }
    if ('/' != path.charAt(0)) {
        path = '/' + path;
    }
    if ('/' != path.charAt(path.length - 1)) {
        path = path + '/';
    }
    if ('//' == path) {
        path = '';
    }
    var ajaxUrl = path + 'jscsp-form.html';
    xhr.open('GET', ajaxUrl, true);
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200) {
            return;
        }
        container.innerHTML = this.responseText;
        var luminositySetting = "dark";
        var overlayColor = "#4d" + randomColor({
            luminosity: luminositySetting,
        }).slice(1);
        $("#colorInput-6").spectrum({
            color: overlayColor,
            showInput: true,
            showAlpha: true,
            preferredFormat: 'rgb',
        });
        for (var i = 1; i < 6; i++) {
            luminositySetting = (i % 2) ? 'dark' : 'light';
            $("#colorInput-" + i).spectrum({
                color: randomColor({
                    luminosity: luminositySetting,
                }),
                preferredFormat: 'hex',
                showInput: true,
            });
        }
        computeAndPreview();

        for (i = 1; i <= 6; i++) {
            $('#colorInput-' + i).on('change.spectrum', computeAndPreview);
        }
        $('#white-opacity').blur(computeAndPreview);
        $('#black-opacity').blur(computeAndPreview);
        $('.color-box').click(function(){
            $(this).toggleClass('selectedBox');
            palettePreview();
        });
    };
    xhr.send();
})(jQuery);
