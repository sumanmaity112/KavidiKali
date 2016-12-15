var lodash = require('lodash');

var rollDice = function(gameMaster, obj) {
    var player = gameMaster.players[obj.player];
    var diceValue = player.hasAnyOtherChance() && player.rollDice(gameMaster.dice);
    gameMaster.setChances(diceValue, player.id) || gameMaster.nextPlayer();
    return diceValue.toString();
};

var moveCoin = function(gameMaster, obj) {
    var player = gameMaster.players[obj.player];
    player.moveCoin(obj.coin, obj.position);
    gameMaster.anyMoreMoves(obj.player) || gameMaster.nextPlayer();
};

exports.actions = {
    rollDice: rollDice,
    moveCoin: moveCoin
};

//========================================================================================================

var getAllDiceValues = function(gameMaster, obj) {
    return JSON.stringify(gameMaster.players[obj.player].diceValues);
};

var refreshBoard = function(gameMaster) {
    var stateOfGame = gameMaster.stateOfGame();
    return JSON.stringify(stateOfGame);
};

var updateWaitingPage = function(gameMaster, obj) {
    return !gameMaster.isFull() && JSON.stringify(Object.keys(gameMaster.players));
};

var updateNotification = function(gameMaster) {
    return gameMaster.getNotification();
};

exports.updates = {
    diceValues: getAllDiceValues,
    board: refreshBoard,
    waitingPage: updateWaitingPage,
    notification: updateNotification
};

//========================================================================================================

var movesTo = function(gameMaster, obj) {
    var player = gameMaster.players[obj.player];
    var coin = player.coins[obj.coin];
    var moves = gameMaster.getAllValidMovesOfCoin(coin, player.diceValues, player.path);
    var temp = JSON.stringify(moves);
    return temp;
};

var checkStatus = function(gameMaster) {
    var status = (!!gameMaster.winner);
    gameMaster = status && !gameMaster.finished ? completedGame(gameMaster) : gameMaster;
    return status.toString();
};

var myNameAndColor = function(gameMaster, obj) {
    var color = gameMaster.players[obj.player].coinColor
    return obj.player + '\nYour coin color : ' + color;
};

var completedGame = function(game) {
    return {
        players: Object.keys(game.players),
        winner: game.winner,
        finished: true
    }
};

var players = function(gameMaster) {
    var result = Object.keys(gameMaster.players).map(function(player) {
        return {
            name: player,
            colour: gameMaster.players[player].coinColor
        }
    })
    return JSON.stringify(result);
};

exports.enquiries = {
    'isValidPlayer': function(gameMaster, obj) {
        return lodash.has(gameMaster.players, obj.player)
    },
    'currentPlayer': function(gameMaster) {
        return gameMaster.currentPlayer;
    },
    'players': players,
    'movesWhere': movesTo,
    'isGameOver': checkStatus,
    'whatIsMyDetails': function(gameMaster, obj) {
        return JSON.stringify({
            'name': obj.player,
            'gameId': gameMaster.id
        })
    },
    'myNameAndColor': myNameAndColor,
    'whoIsTheWinner': function(gameMaster, obj) {
        return gameMaster.winner
    },
    'playerTurn': function(gameMaster, obj) {
        return (4 - Object.keys(gameMaster.players).indexOf(obj.player)).toString();
    },
    'myInfo': function(gameMaster, obj) {
        return JSON.stringify(gameMaster.players[obj.player]);
    },
    'anyMoreChances': function(gameMaster, obj) {
        return gameMaster.anyMoreChances(obj.player).toString();
    }
};
