var clockTimer = 0;
var cardRemoveConfirmation = 0;

/*function renderCard(i) {
	var factionsCopy = factions.slice();
	var myFactions = [];
	var factionPoints = ["+1","-1","-2"];

	for (var x = 0; x < 3; x++) {
		var pickFactionID = randRange(0, factionsCopy.length);
		myFactions.push(factionsCopy[pickFactionID]);
		factionsCopy.splice(pickFactionID, 1);
	}

	var cardDOM = "<div class='card benefit-" + myFactions[0].abbr + "'><div class='title'>Test card " + myFactions[0].abbr + "</div><div class='faction-points'>";

	for (var x = 0; x < myFactions.length; x++) {
		cardDOM += "<div class='faction-" + myFactions[x].abbr + "'>" + factionPoints[x] + "</div>";
	}

	cardDOM += "</div></div>";

	$(".game-board").append(cardDOM);
}*/

function displayTime() {
	/*var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();

	$(".network-badge .clock").html(hours + ":" + minutes + ":" + seconds);*/


	$(".network-badge .clock").html(new Date().toLocaleTimeString('en-US', {hour12:false}));
}

function randRange(start, end) {
	return Math.floor((Math.random() * (end - start) + start));
}

// create game -- does most of the setup
var Game = new CardGame();

$(function() {
	//Start rendering network clock
	displayTime();
	clockTimer = window.setInterval(displayTime, 500);

	// Events
	/*$(".faction-scores .faction").each(function(){
		var randHeight = Math.floor(Math.random() * 100);
		$(this).height(randHeight + "%");
	});*/

	$(".players").on("click", ".player", function() {
		Game.nextTurn();
	});

	$(".game-board").on("click", ".card", function() {
		var thisCard = $(this);
		var cardPosition = "board";
		var cardPositionIndex = $(thisCard).attr("data-card-position-index");
		var player = Game.players[Game.currentPlayer];

		if (Game.checkGameEnded()) {
			return false;
		}

		if (player.turnPhaseTracker <= 1) {
			if (!$(thisCard).hasClass("remove")) {
				$(".card.remove").removeClass("remove");
				$(this).addClass("remove");
				cardRemoveConfirmation = $(this);
			} else {
				$(this).addClass("removed");
				window.setTimeout(function(thisCard) {
					$(thisCard).width(0);
				}, 600, thisCard);
				window.setTimeout(function(thisCard) {
					$(thisCard).remove();
				}, 800, thisCard);

				player.removeCardFromBoard(cardPositionIndex, Game.board);
				//Game.board.removeCard(cardPositionIndex);

				player.turnPhaseTracker++;
			}
		} else if (player.turnPhaseTracker == 2) {
			//Testing turn passing
			player.turnPhaseTracker = 0;
			Game.nextTurn();
		}
	});

	$(".player-hand").on("click", ".card", function() {
		var thisCard = $(this);
		var cardPosition = "hand"; //which player?
		var cardPositionIndex = $(thisCard).attr("data-card-position-index");
		var player = Game.players[Game.currentPlayer];

		//similar logic for adding a card with confirmation
		if (player.turnPhaseTracker == 2) {
			if (!$(thisCard).hasClass("remove")) {
				$(".card.remove").removeClass("remove");
				$(this).addClass("remove");
				cardRemoveConfirmation = $(this);
			} else {
				$(this).addClass("removed");
				window.setTimeout(function(thisCard) {
					$(thisCard).width(0);
				}, 600, thisCard);
				window.setTimeout(function(thisCard) {
					$(thisCard).remove();
				}, 800, thisCard);

				player.removeCardFromBoard(cardPositionIndex, Game.board);
				//Game.board.removeCard(cardPositionIndex);

				player.turnPhaseTracker = 0;
				Game.nextTurn();
			}
		}
	});

	$(document).on("click", function(e) {
		if (cardRemoveConfirmation && !(cardRemoveConfirmation.is(e.target)) && cardRemoveConfirmation.has(e.target).length === 0) {
			$(cardRemoveConfirmation).removeClass("remove");
			console.log("clicked outside remove");
		}
	});

	Game.addPlayer("Andrew");
	Game.addPlayer("Michael");
	Game.addPlayer("Ben");
	Game.addPlayer("Kelly");

	//get update and add players
	//Game.addPlayer("Andrew");

	//when ready with players
	Game.start();

	//Game loop test
	/*while (!Game.checkGameEnded()) {
		Game.round++;
		console.log("%c --- Round " + Game.round + " ---", "color:red");
		//Game.players.forEach(function(player) {
			console.log(Game.players[Game.currentPlayer].name + "'s turn!");

			Game.players[Game.currentPlayer].removeCardFromBoard(randRange(0, Game.board.cards.length), Game.board);
			Game.players[Game.currentPlayer].removeCardFromBoard(randRange(0, Game.board.cards.length), Game.board);
			Game.players[Game.currentPlayer].addCardToBoard(randRange(0, Game.players[Game.currentPlayer].hand.length), Game.board);

			console.log(Game.players[Game.currentPlayer].hand);

			Game.nextTurn();

			//Game.players[Game.currentPlayer].removeCardFromBoard(randRange(0,Game.board.cards.length), Game.board);
			//Game.players[Game.currentPlayer].removeCardFromBoard(randRange(0,Game.board.cards.length), Game.board);
			//Game.players[Game.currentPlayer].addCardToBoard(randRange(0,player.hand.length), Game.board);
			//Game.nextTurn();
		//});
	}*/
});
