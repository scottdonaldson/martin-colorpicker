var WIDTH = 200,
    HEIGHT = 200,
    INDICATOR_WIDTH = 20,
    MOUSE_DOWN = false;

function mouseup() {
    MOUSE_DOWN = false;
}

function mousedown() {
    MOUSE_DOWN = true;
}

function distance(a, b) {
    var xDiff = a[0] - b[0],
        yDiff = a[1] - b[1];
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

function xVal(val, x) {
    return (255 - val) * (1 - INDICATOR_WIDTH / (WIDTH + INDICATOR_WIDTH) - x) + val;
}

function yVal(y) {
    return 255 * y;
}

function clamp(val, min, max) {
    if ( val > max ) return max;
    if ( val < min ) return min;
    return val;
}

function valFromY(y, offset) {
    var output = Math.cos(2 * Math.PI * (y + offset)) + 0.5;
    output = clamp(output, 0, 1);
    return output * 255;
}

function coercePixel(data, x, y, pixel) {

    // normalize X
    x /= (WIDTH - 1);

    pixel.r = xVal(data.r, x);
    pixel.g = xVal(data.g, x);
    pixel.b = xVal(data.b, x);

    // normalize Y
    y /= (HEIGHT - 1);

    pixel.r -= yVal(y);
    pixel.g -= yVal(y);
    pixel.b -= yVal(y);

    pixel.r = clamp(pixel.r, 0, 255);
    pixel.g = clamp(pixel.g, 0, 255);
    pixel.b = clamp(pixel.b, 0, 255);

    return pixel;
}

Martin.registerEffect('colorpicker', function(data) {

    this.context.loop(function(x, y, pixel) {
        return coercePixel(data, x, y, pixel);
    });
});

Martin.registerEffect('indicator', function(data) {

    this.context.loop(function(x, y, pixel) {
        if ( x > WIDTH ) {

            // normalize Y
            y = y / (HEIGHT - 1);

            pixel.r = valFromY(y, 0);
            pixel.g = valFromY(y, 1 / 3);
            pixel.b = valFromY(y, 2 / 3);
        }

        return pixel;
    });
});

function makePicker(input) {

    var template = Martin();

    template.width(WIDTH + INDICATOR_WIDTH).height(HEIGHT);

    template.newLayer();

    template.background('#fff');

    var field = template.colorpicker({
        r: 255,
        g: 0,
        b: 0
    });

    template.indicator();

    template.newLayer();

    var hue = template.rect({
        color: '#666',
        x: WIDTH + 1,
        y: 1,
        height: 4,
        width: INDICATOR_WIDTH - 2,
        stroke: '#fff',
        strokeWidth: 2
    });

    var circle = template.circle({
        radius: 4,
        color: '#666',
        stroke: '#fff',
        strokeWidth: 2,
        x: WIDTH,
        y: 0
    });

    function zFill(str, digits) {
        while ( str.length < digits ) {
            str = '0' + str;
        }
        return str;
    }

    template.mousemove(function(e) {

        var x = e.x,
            y = e.y,
            data,
            pixel;

        if ( MOUSE_DOWN ) {

            // change hue
            if ( x > WIDTH && Math.abs(y - hue.data.y - 0.5 * hue.data.height) < 20 ) {

                // normalize Y
                y /= HEIGHT - 1;

                data = {
                    r: valFromY(y, 0),
                    g: valFromY(y, 1 / 3),
                    b: valFromY(y, 2 / 3)
                };

                hue.data.y = e.y - 2;
                field.data = data;

            } else if ( x <= WIDTH ) {

                // normalize Y
                y /= HEIGHT - 1;

                data = {
                    r: valFromY(y, 0),
                    g: valFromY(y, 1 / 3),
                    b: valFromY(y, 2 / 3)
                };

                circle.data.x = e.x;
                circle.data.y = e.y;
            }

            if ( data ) {
                pixel = coercePixel(data, circle.data.x, circle.data.y, {});

                pixel.r = zFill( Math.round(pixel.r).toString(16), 2 );
                pixel.g = zFill( Math.round(pixel.g).toString(16), 2 );
                pixel.b = zFill( Math.round(pixel.b).toString(16), 2 );

                input.value = '#' + pixel.r.toString(16) + '' + pixel.g.toString(16) + '' + pixel.b.toString(16);
            }
        }
    });

    template.on('mousedown', mousedown);
    template.on('mouseup mouseout mouseleave', mouseup);

    return template;
}

function showPicker(input) {
    var picker = makePicker(input);
    input.parentNode.insertBefore(picker.canvas, input);
}

function loadPicker() {

    var inputs = document.getElementsByTagName('input');
    [].forEach.call(inputs, function(input) {
        if ( input.getAttribute('data-type') === 'martin-colorpicker' ) {
            showPicker(input);
        }
    })
}

window.addEventListener('DOMContentLoaded', loadPicker);
