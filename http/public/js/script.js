function loadPics(){

  var $this, len, i, cmd, el;
  cmd = "images/*.jpg|a";
   ajaxReq(this, cmd, "pics", function ($this, data) {
            if (data.success) {
                len = data.v.length;
                for (i = 0; i < len; i++) {
                    el = '<div><img src="images/' + data.v[i] + '" alt="image:' + i + '"></div>';
                    slider.slickAdd(el);
                }
                callback();
            }
    });
};

function  ajaxReq ($this, cmd, type, callback) {
        var errText;

        $("body").css("cursor", "progress")
        $.ajax({
            url: 'php/' + type + '.php',
            type: 'POST',
            context: $this,
            dataType: 'json',
            data: {
                'cmd': cmd
            }
        }).done(function (data) {
            $("body").css("cursor", "default")
            callback(this, data);
        }).fail(function (XHR, textStatus, errorThrown) {
            errText = getErrorText(XHR.responseText);
            $("body").css("cursor", "default")
            alert(errText);
        });
    };
