var Suites = [
  "Spade",
  "Heart",
  "Diamand",
  "Club"
]
var Values = {
  Ace: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
  Seven: 7,
  Eight: 8,
  Nine: 9,
  Jack: 10,
  Queen: 10,
  King: 10
};

var Player = {
  hit(card) { //this is player
    this.addCards(card);
  },
  addCards(cards) {
    this.cards = this.cards.concat(cards);
    this.updateScore();
  },
  updateScore() {
    var aces = 0;
    this.score = 0;
    for (let card of this.cards) {
      if (card.value === 1) {
        aces += 1;
      }
      this.score += card.value;
    }
    if (aces > 0) {
      this.updatePotentialScore(aces);
    }
  },
  updatePotentialScore(aces) {
    this.potentialScore = this.score;
    for (let i = 0; i < aces; i++) {
      if (this.potentialScore + 10 <= 21) {
        this.potentialScore += 10;
      }
    }
  },
  clearHand() {
    this.cards = [];
    this.acesInHand = 0;
    this.score = 0;
    this.potentialScore = 0;
    this.stay = false;
  }
};

var Deck = {
  shuffle() {
    var length = this.deck.length;
    var randArray = [];
    while (randArray.length !== length) {
      var rand = Math.floor(Math.random() * length);
      if (randArray.includes(rand)) {
        continue;
      } else {
        randArray.push(rand);
      }
    }
    randArray.forEach((num, index, array) => {
      array[index] = this.deck[num];
    })
    this.deck = randArray;
  },
  create() {
    var values = Object.keys(Values);
    values.forEach(value => {
      Suites.forEach(suite => {
        this.deck.push({
          title: `${value} of ${suite}s`,
          value: Values[value]
        });
      });
    });
  },
  removeOneCard() {
    if (this.currentCardIndex === this.deck.length) {
      this.shuffle();
      this.currentCardIndex = 0;
    }
    this.currentCardIndex += 1;
    return this.deck[this.currentCardIndex - 1];
  },
  removeCards(numOfCards) {
    var newCards = [];
    for (let i = 0; i < numOfCards; i++) {
      newCards.push(this.removeOneCard());
    }
    return newCards;
  }
};

var Dealer = Object.assign(Object.create(Player), {
  dealHand(player) {
    player.addCards(this.deck.removeCards(2));
  },
});

var UI = {
  init() {
    this.$playerHand = document.getElementById("playerHand");
    this.$playerScore = document.getElementById("playerScore");
    this.$dealerHand = document.getElementById("dealerHand");
    this.$dealerScore = document.getElementById("dealerScore");
    this.$playerHit = document.getElementById("playerHit");
    this.$playerHit.addEventListener('click', this.playerHit.bind(this));
    this.$playerStay = document.getElementById("playerStay");
    this.$playerStay.addEventListener('click', this.playerStay.bind(this));
    this.$newGame = document.getElementById("newGame");
    this.$newGame.addEventListener('click', this.newGame.bind(this));
  },
  updatePlayer(type) {
    var hand = this[`$${type}Hand`];
    var score = this[`$${type}Score`];
    hand.innerHTML = "";
    score.textContent = "";
    this[type].cards.forEach(card => {
      let $card = document.createElement("div");
      $card.className = "card";
      let text = document.createTextNode(card.title);
      $card.appendChild(text);
      hand.appendChild($card);
      score.textContent = Math.max(this[type].score, this[type].potentialScore);
    });
  },
  outcome(type, text) {
    var hand = this[`$${type}Hand`];
    this.player.stay = true;
    let p = document.createElement("p");
    let t = document.createTextNode(text);
    p.appendChild(t);
    hand.appendChild(p);
  },
};

var Application = Object.assign(Object.create(UI), {
  newGame() {
    this.player.clearHand();
    this.dealer.clearHand();
    this.dealer.dealHand(this.player);
    this.checkPlayerScore();
    this.updatePlayer("dealer");
  },
  playerHit(event, player = this.player) {
    if (player.score < 21 && player.potentialScore < 21 && player.stay === false) {
      player.hit(this.dealer.deck.removeOneCard());
      this.checkPlayerScore();
    }
  },
  checkPlayerScore(player = this.player) {
    this.updatePlayer("player");
    if (player.score > 21) {
      this.outcome("player", "Aww, you BUSTED!");
    } else if (player.score === 21 || player.potentialScore === 21) {
      player.score = Math.max(player.score, player.potentialScore);
      this.outcome("player", "you WIN!");
    }
  },
  checkDealerScore(player = this.dealer) { //TODO
    this.updatePlayer("dealer");
    if (player.score >= this.player.score || player.score >= 21) {
      return false;
    } else if (player.potentialScore >= this.player.score && player.potentialScore <= 21) {
      player.score = player.potentialScore;
      return false;
    } else {
      return true;
    }
  },
  playerStay() {
    if (this.player.stay === false) {
      this.player.stay = true;
      this.dealersTurn();
    }
  },
  dealersTurn() {
    this.dealer.dealHand(this.dealer);
    while (this.checkDealerScore()) {
      this.dealer.hit(this.dealer.deck.removeOneCard());
    }
    this.updatePlayer("dealer");
    if (this.dealer.score === this.player.score) {
      this.outcome("dealer", "TIE")
    } else if (this.dealer.score > this.player.score && this.dealer.score <= 21) {
      this.outcome("dealer", "dealer WINS!")
    } else {
      this.outcome("dealer", "dealer BUSTED!");
    }
  }
});

function setupPlayer() {
  var player = Object.create(Player);
  player.cards = [];
  player.score = 0;
  player.potentialScore = 0;
  player.stay = false;
  return player;
}

function setupDeck() {
  var deck = Object.create(Deck);
  deck.deck = [];
  deck.currentCardIndex = 0;
  deck.create();
  deck.shuffle();
  return deck;
}

function setupDealer() {
  var dealer = Object.create(Dealer);
  dealer.cards = [];
  dealer.deck = setupDeck();
  return dealer;
}

function setupApplication() {
  var app = Object.create(Application);
  app.player = setupPlayer();
  app.dealer = setupDealer();
  return app;
}

var App = setupApplication();
App.init();
App.newGame();