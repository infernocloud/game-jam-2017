// load cardDefinitions.js before this file

var factions = {
	"military": {
		abbr: "mil"
	},
	"agriculture": {
		abbr: "agr"
	},
	"education": {
		abbr: "edu"
	},
	"business": {
		abbr: "bus"
	}
};

class CardGame {
	loadDeck() {
		// temporary "deck" array
		let deck = [];
		for (let i = 0; i < 2; i++) {
			//Load 2 of each card type into deck
			cardDefs.forEach(function(obj) {
				deck.push(new Card(
					obj.flavortext,
					obj.military,
					obj.education,
					obj.agriculture,
					obj.business
				));
			});
		}
		this.cards = deck;
	}
	addPlayer(name) {
		this.players.push(new Player(name, this.players.length + 1));
	}
	start() {
		/**
		 * This for loop deals the first 24 cards to the board
		 * (cards 0 - 23 from cards array)
		 * shuffling is already handled
		 */
		for (let i = 0; i < 24; i++) {
			console.log("Dealt to board");
			this.board.addCard(this.cards[i]);
		}

		/**
		 * This for loop deals the remaining 24 cards to players
		 * (cards 24 - 47 from cards array)
		 * shuffling is already handled
		 * @TODO change to drafting
		 */
		for (let a = 0; a < this.players.length; a++) {
			for (let i = 24; i < (24 + 24 / this.players.length); i++) {
				console.log("Dealt to " + this.players[a].name);
				this.players[a].addCard(this.cards[i + (a * 24 / this.players.length)]);
			}
		}

		$(".player-1").addClass("active");
	}
	checkGameEnded() {
		if (this.board.cards.length <= this.players.length) {
			this.end();
			return true;
		}
		return false;
	}
	end() {
		let factionHighest = {
			military:    50,
			education:   50,
			agriculture: 50,
			business:    50,
			overall:     50
		}
		this.players.forEach(function(player) {
			player.calcFactionFavors();
			if (player.favor.military < factionHighest.military) {
				factionHighest.military = player.favor.military;
			}
			if (player.favor.education < factionHighest.education) {
				factionHighest.education = player.favor.education;
			}
			if (player.favor.agriculture < factionHighest.agriculture) {
				factionHighest.agriculture = player.favor.agriculture;
			}
			if (player.favor.business < factionHighest.business) {
				factionHighest.business = player.favor.business;
			}
			let num;
			for (num in player.favor) {
				if (player.favor[num] < factionHighest.overall) {
					factionHighest.overall = player.favor[num];
				}
			}
		});
		this.players.forEach(function(player) {
			player.score = 0;
			player.factions = [];
			if (player.favor.military == factionHighest.military) {
				player.score++;
				player.factions.push("military");
			}
			if (player.favor.education == factionHighest.education) {
				player.score++;
				player.factions.push("education");
			}
			if (player.favor.agriculture == factionHighest.agriculture) {
				player.score++;
				player.factions.push("agriculture");
			}
			if (player.favor.business == factionHighest.business) {
				player.score++;
				player.factions.push("business");
			}
			let num;
			for (num in player.favor) {
				if (player.favor[num] == factionHighest.overall) {
					player.score++;
				}
			}
		});
		let classes = [];
		this.board.cards.forEach(function(card) {
			let prop;
			for (prop in card) {
				if (card[prop] == 1) {
					classes.push(prop);
				}
			}
		});
		for (let i = 0; i < classes.length; i++) {
			this.players.forEach(function(player) {
				if (player.factions.includes(classes[i])) {
					player.score++;
				}
			});
		}
		let winScore = -1;
		this.players.forEach(function(player) {
			if (player.score > winScore) {
				winScore = player.score;
			}
		});
		// temporary winners array
		let winners = [];
		this.players.forEach(function(player) {
			if (player.score == winScore) {
				winners.push(player);
			}
		});
		this.winners = winners;
	}
	shuffleCards() {
		for (let i = this.cards.length; i; i--) {
			let j = Math.floor(Math.random() * i);
			[this.cards[i - 1], this.cards[j]] = [this.cards[j], this.cards[i - 1]];
		}
	}
	nextTurn() {
		this.currentPlayer++;
		if (this.currentPlayer >= this.players.length) {
			this.currentPlayer = 0;
		}

		$(".active").removeClass("active");
		$(".player-" + (this.currentPlayer + 1)).addClass("active");
	}
	constructor() {
		this.cards   = [];
		this.players = [];
		this.winners = [];
		this.board   = new Board();
		this.currentPlayer = 0;
		this.round = 0;
		this.loadDeck();
		this.shuffleCards();
	}
}

class Board {
	constructor() {
		this.cards = [];
	}
	addCard(card) {
		card.location = this;
		this.cards.push(card);
		card.renderCard(".game-board", "board", this.cards.length - 1);
	}
	removeCard(i) {
		//this.cards[i].cardDOM.remove();
		this.cards.splice(i, 1);
		console.log("Removed card from board!");
		console.log(this.cards);
	}
}

class Card {
	constructor(f, m, e, a, b, o) {
		this.flavortext  = f;
		this.military    = m;
		this.education   = e;
		this.agriculture = a;
		this.business    = b;
		this.location    = o;
	}
	renderCard(target, cardPosition, cardPositionIndex) {
		//target = ".game-board" or ".player-x-hand"
		var factionPoints = [
			{key: "military", points: this.military},
			{key: "education", points: this.education},
			{key: "agriculture", points: this.agriculture},
			{key: "business", points: this.business}
		];

		factionPoints.forEach(function(faction, i) {
			if (faction.points === 0) {
				factionPoints.splice(i,1);
			}
		});

		factionPoints.sort(function(a,b) {
			if (a.points > b.points) {
				return -1;
			}

			if (a.points < b.points) {
				return 1;
			}

			//both are equal
			return 0;
		});

		console.log(factionPoints);

		var cardDOM = "<div class='card benefit-" + factions[factionPoints[0].key].abbr + "' data-card-position='" + cardPosition + "' data-card-position-index='" + cardPositionIndex + "'><div class='title'>" + this.flavortext + "</div><div class='faction-points'>";

		for (var x = 0; x < factionPoints.length; x++) {
			cardDOM += "<div class='faction-" + factions[factionPoints[x].key].abbr + "'>" + factionPoints[x].points + "</div>";
		}

		cardDOM += "</div></div>";

		this.cardDOM = $(cardDOM);

		$(target).append(this.cardDOM);
	}
}

class Player {
	constructor(name, playerID) {
		this.name      = name;
		this.playerID = playerID;
		this.playerDOM = 0;
		this.hand      = [];
		this.scoreZone = [];
		this.score     = 0;  // set by final scoring in Game.end()
		this.favor     = {}; // populated by calcFactionFavors function
		this.factions  = []; // populated by final scoring in Game.end()
		this.turnPhaseTracker = 0;

		this.renderPlayer(".players");
	}
	calcFactionFavors() {
		// temporary favor object
		let favors = {
			military:    0,
			education:   0,
			agriculture: 0,
			business:    0
		}
		// calculate
		this.scoreZone.forEach(function(card) {
			console.log(card);
			favors.military    += card.military;
			favors.education   += card.education;
			favors.agriculture += card.agriculture;
			favors.business    += card.business;
		});
		this.favor = favors;

		//update display
		$(this.playerDOM).find(".faction-mil").html(this.favor.military);
		$(this.playerDOM).find(".faction-agr").html(this.favor.agriculture);
		$(this.playerDOM).find(".faction-edu").html(this.favor.education);
		$(this.playerDOM).find(".faction-bus").html(this.favor.business);
	}
	addCard(card) {
		card.location = this;
		this.hand.push(card);
	}
	removeCardFromBoard(i, gameBoard) {
		this.scoreZone.push(gameBoard.cards[i]);
		console.log(gameBoard.cards[i]);
		gameBoard.cards[i].location = this.scoreZone;
		gameBoard.removeCard(i);
		this.calcFactionFavors();
	}
	addCardToBoard(i, gameBoard) {
		gameBoard.addCard(this.hand[i]);
		this.hand[i].location = gameBoard;
		this.hand.splice(i, 1);
	}
	renderPlayer(target) {
		var playerDOM = '\
		<div class="player player-' + this.playerID + '">\
			<div class="breaking-news">Breaking News</div>\
			<div class="player-stats">\
				<div class="player-name">' + this.name + '</div>\
				<div class="faction-scores">\
					<div class="faction faction-mil">0</div>\
					<div class="faction faction-agr">0</div>\
					<div class="faction faction-edu">0</div>\
					<div class="faction faction-bus">0</div>\
				</div>\
			</div>\
		</div>';

		this.playerDOM = $(playerDOM);

		$(target).append(this.playerDOM);
	}
}
