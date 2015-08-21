Martin.registerEffect('colorpicker', function(data) {

    var red = data.r,
        green = data.g,
        blue = data.b,
        width = this.base.width(),
        height = this.base.height();

    this.context.loop(function(x, y, pixel) {

        pixel.r = (255 - red) * (width - 20 - x) / width + red;
        pixel.g = (255 - green) * (width - 20 - x) / width + green;
        pixel.b = (255 - blue) * (width - 20 - x) / width + blue;

        pixel.r -= 255 * y / height;
        pixel.g -= 255 * y / height;
        pixel.b -= 255 * y / height;

        return pixel;
    });
});

Martin.registerEffect('indicator', function(data) {

    var width = this.base.width(),
        height = this.base.height();

    this.context.loop(function(x, y, pixel) {
        if ( x + 20 > width ) {
            pixel.r = Math.cos((y / height) * 2 * Math.PI) * 255 + 127.5;
            pixel.g = Math.cos((y / height) * 2 * Math.PI + (2/3) * Math.PI) * 255 + 127.5;
            pixel.b = Math.cos((y / height) * 2 * Math.PI + (4/3) * Math.PI) * 255 + 127.5;
        }
        return pixel;
    });
});

function makePicker() {

    var template = Martin();

    template.width(220);
    template.height(200);

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
        x: template.width() - 18,
        y: 1,
        height: 4,
        width: 18,
        stroke: '#fff',
        strokeWidth: 2
    });
    hue.bumpToTop();

    template.mousemove(function(e) {
        var height = template.height();
        var data = {
            r: Math.cos((e.y / height) * 2 * Math.PI) * 255 + 127.5,
            g: Math.cos((e.y / height) * 2 * Math.PI + (2/3) * Math.PI) * 255 + 127.5,
            b: Math.cos((e.y / height) * 2 * Math.PI + (4/3) * Math.PI) * 255 + 127.5,
        };
        field.data = data;
    });

    return template;
}

function showPicker(input) {
    var picker = makePicker();
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
