function newGames() {
    $.get("chooseNoOfPlayer.html", function (data) {
        $('#selectGame').html(data);
    });
}
