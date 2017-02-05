// load cardDefinitions.js before this file

class CardGame {
	loadDeck() {
		// temporary "deck" array
		let deck = [];
		for (let i = 0; i < 2; i++) {
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
		this.players.push(new Player(name));
	}
	startDraft() {
		let g = this; // buffer
		$("#draft").empty().append("<span class='caption'>" + g.players[0].name + " is picking!</span>");
		$("#board").empty().append("<span class='caption'>" + g.players[0].name + " - remove 2!</span>");
		for (let i = 0; i < 24; i++) {
			console.log("Dealt to board");
			this.board.addCard(this.cards[i]);
			$("<div>mil:" 
				+ this.cards[i].military + " edu:" 
				+ this.cards[i].education + " agr:" 
				+ this.cards[i].agriculture + " bus:" 
				+ this.cards[i].business + " ***** " 
				+ this.cards[i].flavortext + "</div>"
			).appendTo("#board").click(function() {
				g.players[g.currentPlayer].removeCardFromBoard(i, g.board);
				$(this).remove();
				if (g.players[g.currentPlayer].removed == 2) {
					$("#board .caption").html("<span class='caption'>" + g.players[g.currentPlayer].name + " - add one card!</span>");
					g.players[g.currentPlayer].hand.forEach(function(e, w) {
						$("<div>mil:" 
							+ e.military + " edu:" 
							+ e.education + " agr:" 
							+ e.agriculture + " bus:" 
							+ e.business + " ***** " 
							+ e.flavortext + "</div>"
						).appendTo("#cards").click(function() {
							$(this).remove();
							g.players[g.currentPlayer].addCardToBoard(w, g.board);
							$("#cards").empty();
							g.nextTurn();
						});
					});
				}
			});
		}
		for (let i = 24; i < 48; i++) {
			$("<div>mil:" 
				+ this.cards[i].military + " edu:" 
				+ this.cards[i].education + " agr:" 
				+ this.cards[i].agriculture + " bus:" 
				+ this.cards[i].business + " ***** " 
				+ this.cards[i].flavortext + "</div>"
			).appendTo("#draft").click(function() {
				g.players[g.currentPlayer].addCard(g.cards[i]);
				$(this).remove();
				g.nextTurn();
				$("#draft .caption").html(g.players[g.currentPlayer].name + " is picking!");
				g.checkDraftEnd();
			});
		}
	}
	checkDraftEnd() {
		if (this.players[this.players.length - 1].hand.length == (24 / this.players.length)) {
			this.start();
		}
	}
	checkGameEnded() {
		if (this.board.cards.length <= this.players.length) {
			this.end();
			return true;
		}
		return false;
	}
	start() {
		$("#draft").hide();
		$("#board").show();
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
		this.players[this.currentPlayer].removed = 0;
	}
	constructor() {
		this.cards   = [];
		this.players = [];
		this.winners = [];
		this.board   = new Board();
		this.currentPlayer = 0;
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
	}
	removeCard(i) {
		this.cards.splice(i, 1);
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
}

class Player {
	constructor(name) {
		this.name      = name;
		this.hand      = [];
		this.scoreZone = [];
		this.removed   = 0;  // used to keep track of turn
		this.score     = 0;  // set by final scoring in Game.end()
		this.favor     = {}; // populated by calcFactionFavors function
		this.factions  = []; // populated by final scoring in Game.end()
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
			favors.military    += card.military;
			favors.education   += card.education;
			favors.agriculture += card.agriculture;
			favors.business    += card.business;
		});
		this.favor = favors;
	}
	addCard(card) {
		card.location = this;
		this.hand.push(card);
	}
	removeCardFromBoard(i, gameBoard) {
		this.scoreZone.push(gameBoard.cards[i]);
		gameBoard.cards[i].location = this.scoreZone;
		gameBoard.removeCard(i);
		this.removed++;
	}
	addCardToBoard(i, gameBoard) {
		gameBoard.addCard(this.hand[i]);
		this.hand[i].location = gameBoard;
		this.hand.splice(i, 1);
	}
}

