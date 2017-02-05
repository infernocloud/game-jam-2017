var factions = [
	{
		key:"military",
		abbr: "mil"
	},
	{
		key:"agriculture",
		abbr: "agr"
	},
	{
		key:"business",
		abbr: "bus"
	},
	{
		key:"education",
		abbr: "edu"
	}
];

var clockTimer = 0;
var cardRemoveConfirmation = 0;

$(".faction-scores .faction").each(function(){
	var randHeight = Math.floor(Math.random() * 100);
	$(this).height(randHeight + "%");
});

$(".players").on("click", ".player", function() {
	$(".active").removeClass("active");
	$(this).addClass("active");
});

$(".game-board").on("click", ".card", function() {
	var thisCard = $(this);

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
	}
});

$(document).on("click", function(e) {
	if (!(cardRemoveConfirmation.is(e.target)) && cardRemoveConfirmation.has(e.target).length === 0) {
		$(cardRemoveConfirmation).removeClass("remove");
		console.log("clicked outside remove");
	}
});

function renderPlayer(i) {
	var playerDOM = '\
	<div class="player player-' + i + '">\
		<div class="player-name">Player ' + i + '</div>\
		<div class="faction-scores">\
			<div class="faction faction-mil"></div>\
			<div class="faction faction-agr"></div>\
			<div class="faction faction-edu"></div>\
			<div class="faction faction-bus"></div>\
		</div>\
	</div>';
}

function renderCard(i) {
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
}

function displayTime() {
	/*var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	var seconds = currentTime.getSeconds();

	$(".network-badge .clock").html(hours + ":" + minutes + ":" + seconds);*/


	$(".network-badge .clock").html(new Date().toLocaleTimeString('en-US', {hour12:false}));
}

function gameStart() {
	for (var i=0; i<24; i++) {
		renderCard(i);
	}

	displayTime();
	clockTimer = window.setInterval(displayTime, 500);
}

function randRange(start, end) {
	return Math.floor((Math.random() * (end - start) + start));
}

gameStart();
