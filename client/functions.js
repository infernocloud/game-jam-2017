// load cardDefinitions.js before this file
// load classes.js before this file also


function randInt(max) {
	// return random int from 0 to max
    // i only used this function for the game simulation
    // (safe to delete whenever game simulation goes away)
	return Math.floor(Math.random() * max);
}

// create game -- does most of the setup
var Game = new CardGame();


// add players
Game.addPlayer("Andrew");
Game.addPlayer("Michael");
Game.addPlayer("Ben");
Game.addPlayer("Kelly");

// then call .start().
// this function deals cards to the board and then to players.
// need to edit this function if we implement draft pick.
Game.start();


/** 
 * turn order:
 * 
 * Game.players[Game.currentPlayer]  =  will give the actual player object
 *
 * 
 * 1.  call  .removeCardFromBoard(int, Game.board)  on player, twice
 * 2.  call  .addCardToBoard(int, Game.board)  on player
 * 3.  call  .nextTurn()  on the game object
 * 4.  call  .checkGameEnded()  on the game object
 *     i.  This function will return false if the game is still going.
 *    ii.  It will call  .end()  on the game and return true otherwise.
 *   iii.  The  .end()  function will calculate scores and provide data as follows:
 *         a)  Player.factions:  array of the factions a player won.
 *         b)  Player.score:     number of victory points.
 *         c)  Game.winners:     array of all the winners as Player objects.
 */


// simulates the game
console.log("%c Game started!", "color:red");
let round = 0;
while (!Game.checkGameEnded()) {
	round++;
	console.log("%c --- Round " + round + " ---", "color:red")
	Game.players.forEach(function(player) {
		console.log(Game.players[Game.currentPlayer].name + "'s turn!");

        player.removeCardFromBoard(randInt(Game.board.cards.length), Game.board);
        player.removeCardFromBoard(randInt(Game.board.cards.length), Game.board);
        player.addCardToBoard(randInt(player.hand.length), Game.board);
		
		Game.nextTurn();
		
	});
}
console.log("%c Game ended!", "color:red");