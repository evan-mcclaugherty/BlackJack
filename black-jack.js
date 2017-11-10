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

function setupPlayer() {
  var player = Object.create(Player);
  player.cards = [];
  player.score = 0;
  player.scoreWithAces
  return player;
}
var Player = {
  hit() {},
  stay() {},
  bet() {},
  win() {},
  lose() {},
  bust() {},
  addCards(cards) {
    this.cards = this.cards.concat(cards);
    this.updateScore();
  },
  updateScore() {
    this.score = 0;
    for (let card of this.cards) {
      this.score += card.value;
    }
  },
  clearHand() {
    this.cards = [];
  }
};
var UI = {
  cardTemplate: `
    <div class="card">
      <p class="card-title"></p>
      <p class="card-value"></p>
    </div>
  `,
  init() {
    this.$playerHand = document.getElementById("playerHand");
    this.$dealerHand = document.getElementById("dealerHand");
    this.$playerHit = document.getElementById("playerHit");
    this.$playerStay = document.getElementById("playerStay");
  }
};

function setupDeck() {
  var deck = Object.create(Deck);
  deck.deck = [];
  deck.currentCardIndex = 0;
  deck.create();
  deck.shuffle();
  return deck;
}
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

function setupDealer() {
  var dealer = Object.create(Dealer);
  dealer.cards = [];
  dealer.deck = setupDeck();
  return dealer;
}
var Dealer = Object.assign(Object.create(Player), {
  dealHand(player) {
    player.addCards(this.deck.removeCards(2));
  },
});

function setupGame() {
  var game = Object.create(BlackJack);
  game.player = setupPlayer();
  game.dealer = setupDealer();
  return game;
}
var BlackJack = {
  newGame() {
    this.player.clearHand();
    this.dealer.clearHand();
    this.dealer.dealHand(this.player);
  }
};

var game = setupGame();
game.newGame();
console.log(game.player.score);