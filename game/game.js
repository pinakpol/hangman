const WordManager = require("./WordManager");

class Game {

    constructor() {

        this.words = new WordManager();

        this.maxAttempts = 6;

        this.reset();

    }

    reset() {

        this.status = "idle";

        this.category = "";

        this.word = "";

        this.hint = "";

        this.used = [];

        this.remaining = this.maxAttempts;

    }

    start(category) {

        const data = this.words.random(category);

        if (!data)
            return false;

        this.category = category;

        this.word = data.word.toUpperCase();

        this.hint = data.hint;

        this.used = [];

        this.remaining = this.maxAttempts;

        this.status = "playing";

        return true;

    }

    guess(letter) {

        if (this.status != "playing")
            return;

        letter = letter.toUpperCase();

        if (this.used.includes(letter))
            return;

        this.used.push(letter);

        if (!this.word.includes(letter))
            this.remaining--;

        if (this.remaining <= 0) {

            this.status = "lose";

            return;

        }

        let win = true;

        for (const c of this.word) {

            if (!this.used.includes(c)) {

                win = false;

                break;

            }

        }

        if (win)
            this.status = "win";

    }

    displayWord() {

        let s = "";

        for (const c of this.word) {

            if (this.used.includes(c))
                s += c + " ";
            else
                s += "_ ";

        }

        return s.trim();

    }

    wrongLetters() {

        return this.used.filter(x => !this.word.includes(x));

    }

    letterStates() {

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        let list = [];

        for (const c of alphabet) {

            let state = "unused";

            if (this.used.includes(c)) {

                if (this.word.includes(c))
                    state = "correct";
                else
                    state = "wrong";

            }

            list.push({

                letter: c,

                state: state

            });

        }

        return list;

    }

    state() {

        return {

            status: this.status,

            category: this.category,

            hint: this.hint,

            display: this.displayWord(),

            attempts: this.remaining,

            maxAttempts: this.maxAttempts,

            wrong: this.wrongLetters(),

            letters: this.letterStates(),

            hangmanStage:
                this.maxAttempts - this.remaining

        };

    }

}

module.exports = Game;