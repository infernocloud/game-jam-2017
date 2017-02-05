// load cardDefinitions.js before this file
// load classes.js before this file also

function randInt(max) {
	// return random int from 0 to max
	return Math.floor(Math.random() * max);
}

// create game -- does most of the setup
var Game = new CardGame();

$("#playersSelection").show();
$("#playersNames").hide();
$("#draft").hide();
$("#board").hide();

var numplayers = 0;

$("#playersSelection button").click(function() {
	numplayers = +$(this).attr("data-amt");
	$("#playersSelection").hide();
	$("#playersNames").show();
	for (let i = 0; i < numplayers; i++) {
		$("#playersNames").append("<input data-player='" + i + "' type='text' />");
	}
	$("<button>Go!</button>").appendTo("#playersNames").click(function() {
		for (let i = 0; i < numplayers; i++) {
			Game.addPlayer($("#playersNames").find("[data-player='" + i + "']").val());
		}
		$("#playersNames").hide();
		$("#draft").show();
		// start game
		Game.startDraft();
	});
});


/*
// simulates the game
console.log("%c Game started!", "color:red");
let round = 0;
while (!Game.checkGameEnded()) {
	round++;
	console.log("%c --- Round " + round + " ---", "color:red")
	Game.players.forEach(function(player) {
		player.removeCardFromBoard(randInt(Game.board.cards.length), Game.board);
		player.removeCardFromBoard(randInt(Game.board.cards.length), Game.board);
		player.addCardToBoard(randInt(player.hand.length), Game.board);
	//	console.log(Game.players[Game.currentPlayer].name + "'s turn ended!");
		
		Game.nextTurn();
		
	});
}
console.log("%c Game ended!", "color:red");
*/