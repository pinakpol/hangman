const Game = require("./Game");

class GameManager {

    constructor() {

        this.games = {};

    }

    getGame(boardID) {

        if (!this.games[boardID]) {

            this.games[boardID] = new Game();

        }

        return this.games[boardID];

    }

    start(boardID, category) {

        return this.getGame(boardID).start(category);

    }

    guess(boardID, letter) {

        this.getGame(boardID).guess(letter);

    }

    state(boardID) {

        return this.getGame(boardID).state();

    }

    reset(boardID) {

        this.getGame(boardID).reset();

    }

}

module.exports = GameManager;