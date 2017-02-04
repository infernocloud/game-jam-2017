// load cardDefinitions.js before this file

class CardGame {
	addCard(card) {
		this.cards.push(card);
	}
	addPlayer(name) {
		this.players.push(new Player(name));
	}
	start() {

	}
	end() {

	}
	constructor() {
		this.cards   = [];
		this.players = [];
		this.turn    = 0;
	}
}

class Card {
	constructor(f, m, e, a, b, o) {
		this.flavortext  = f;
		this.military    = m;
		this.education   = e;
		this.agriculture = a;
		this.business    = b;
		this.owner       = o;
	}
}

class Player {

	constructor(name) {
		this.name      = name;
		this.hand      = [];
		this.scoreZone = [];
		this.favor     = { /* populated by function */ }
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
}

