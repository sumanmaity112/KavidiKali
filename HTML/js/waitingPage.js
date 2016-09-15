var waiting = function () {
    var count = 0;
    return function () {
        $('#dot_' + count).removeClass("selected_waiting_dot");
        count = (count + 1) % 3;
        $('#dot_' + count).addClass("selected_waiting_dot");
    };
}();

window.onload = function () {
    setInterval(waiting, 500);
    updateJoinedPlayers();
};

var updateJoinedPlayers = function () {
    var timer = setInterval(function () {
        $.get('update?toUpdate=waitingPage', function (data, status) {
            if (data) {
                var list = JSON.parse(data);
                $('.players').html(convertIntoHtml(list));
            }
            else {
                clearInterval(timer);
                $(location).attr('href', '/kavidiKali.html');
            }
        });
    }, 500);
};

var createDiv = function (text) {
    return ['\n<div class="player">', text, ' joined</div>'].join(" ");
};

var convertIntoHtml = function (list) {
    var html = "";
    for (var i = 0; i < list.length - 1; i++) {
        html += createDiv(list[i]);
    }
    ;
    html += ['\n<div class="player" id="last_player">', list[i], ' joined</div>'].join(" ");
    return html;
};