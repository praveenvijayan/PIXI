(function () {
    "use strict";
    $(function () {
        if (!window.File && !window.FileReader && !window.FileList && !window.Blob) {
            alert('The File APIs are not fully supported in this browser.');
            return;
        }

        if (!$('body').find('#pixiOverlay').length) {
            $('body').append('<div id="pixiOverlay" style="height:' + $(document).height() + 'px"></div>');
        }

        var dropZone = $('#pixiOverlay');

        if (localStorage.getItem('pixiImage')) {
            setBackground();
        }

        dropZone.on('dragover', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var orginalEvt = evt.originalEvent.dataTransfer;
            orginalEvt.dropEffect = 'copy'; // Explicitly show this is a copy.  
            dropZone.addClass('pixiOver');
        });

        dropZone.on('dragleave', function (evt) {
            dropZone.removeClass('pixiOver');
        })

        dropZone.on('drop', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var orginalEvt = evt.originalEvent.dataTransfer;
            var files = orginalEvt.files; // FileList object.  
            dropZone.removeClass('pixiOver');
            var reader = new FileReader();
            reader.readAsDataURL(files[0])
            reader.onload = function () {
                localStorage.setItem('pixiImage', this.result);
                setBackground();
            }

        });

        var mouseDown = false,
            shiftDown = false;

        if ($('body #pixiOverlay')) {
            dropZone.on('mousedown', function (event) {
                mouseDown = true;
            });

            dropZone.on('mousemove', function (event) {
                if ($('#pixiOverlay').hasClass('hasItem') && mouseDown && shiftDown && $('#pixiOverlay').is(':visible')) {
                    moveBackground(event)
                }
            })

            dropZone.on('mouseup', function (evt) {
                mouseDown = false;
                dropZone.css('cursor', 'default')
            });
        }


        function setBackground() {
            var dataUri = localStorage.getItem('pixiImage');
            var pos = localStorage.getItem('pixiPos');
            var opa = localStorage.getItem('pixiOpacity') || 1;
            dropZone.css({
                'background-repeat': 'no-repeat',
                'background-image': 'url(' + dataUri + ')',
                'background-position': pos,
                'opacity': opa
            });
            dropZone.addClass('hasItem')
        }

        var winwid = $(window).width(),
            winhig = $(window).height();

        function moveBackground(evt) {
            var toLeft = evt.clientX;
            var toTop = evt.clientY;
            if (toLeft < winwid && toTop < winhig) {
                dropZone.css('background-position', "" + toLeft + "px " + toTop + "px");
                localStorage.setItem('pixiPos', "" + toLeft + "px " + toTop + "px");
                dropZone.css('cursor', 'move')
            }
        }

        $(document).keydown(function (e) {
            var bpl = parseInt($('#pixiOverlay').css('background-position').split(' ')[0].replace('px', ''));
            var bpt = parseInt($('#pixiOverlay').css('background-position').split(' ')[1].replace('px', ''));
            var pixOp = 0;

            var keyCode = e.keyCode || e.which,
                arrow = {
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    grid: 71,
                    zindex: 90,
                    shift: 16,
                    see:80,
                    opacity: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]
                };

                console.log(keyCode)

            switch (keyCode) {
                case arrow.left:
                    bpl--;
                    $('#pixiOverlay').css('background-position', '' + bpl + 'px ' + bpt + 'px');
                    break;
                case arrow.up:
                    bpt--;
                    $('#pixiOverlay').css('background-position', '' + bpl + 'px ' + bpt + 'px');
                    break;
                case arrow.right:
                    bpl++;
                    $('#pixiOverlay').css('background-position', '' + bpl + 'px ' + bpt + 'px');
                    break;
                case arrow.down:
                    bpt++;
                    $('#pixiOverlay').css('background-position', '' + bpl + 'px ' + bpt + 'px');
                    break;
                case arrow.grid:
                    $('#pixiOverlay').toggleClass('pixiToggle');
                    break;
                case arrow.zindex:
                    $('#pixiOverlay').toggleClass('lowZindex');
                    break;
                case arrow.shift:
                    shiftDown = true;
                    break;
                case arrow.see:
                    $('#pixiOverlay').toggleClass('pointerDisable');
                    break;
                default:
                    if (keyCode >= 48 && keyCode <= 57) {
                        $.each(arrow.opacity, function (i, val) {
                            if (arrow.opacity[i] === keyCode) {
                                pixOp = i / 10 || 1;
                                $('#pixiOverlay').css('opacity', pixOp);
                                localStorage.setItem('pixiOpacity', pixOp);
                            }
                        })
                    }
                    break;
            }

            localStorage.setItem('pixiPos', '' + bpl + 'px ' + bpt + 'px')
        });
        $(document).keyup(function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode == 16) {
                shiftDown = false;
            }
        })

    });

})()