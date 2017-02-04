// load classes.js before this file

var Game = new CardGame();

for (i = 0; i < 2; i++) {
    cardDefs.forEach(function(obj) {
        Game.addCard(new Card(
            obj.flavortext,
            obj.military,
            obj.education,
            obj.agriculture,
            obj.business
        ));
    });
}

