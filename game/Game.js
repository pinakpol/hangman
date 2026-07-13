const WordManager = require("./WordManager");

class Game
{
    constructor()
    {
        this.words = new WordManager();

        this.maxAttempts = 6;

        this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        this.reset();
    }

    //------------------------------------------------

    reset()
    {
        this.status = "idle";

        this.category = "";

        this.word = "";

        this.hint = "";

        this.used = [];

        this.remaining = this.maxAttempts;
    }

    //------------------------------------------------

    start(category)
    {
        const data = this.words.random(category);

        if(!data)
            return false;

        this.category = category;

        this.word = data.word.toUpperCase();

        this.hint = data.hint;

        this.used = [];

        this.remaining = this.maxAttempts;

        this.status = "playing";

        return true;
    }

    //------------------------------------------------

    guess(letter)
    {
        if(this.status != "playing")
            return;

        if(!letter)
            return;

        letter = letter.toUpperCase();

        if(this.used.includes(letter))
            return;

        this.used.push(letter);

        if(!this.word.includes(letter))
            this.remaining--;

        if(this.remaining <= 0)
        {
            this.status = "lose";
            return;
        }

        let win = true;

        for(const c of this.word)
        {
            if(c == " ")
                continue;

            if(!this.used.includes(c))
            {
                win = false;
                break;
            }
        }

        if(win)
            this.status = "win";
    }

    //------------------------------------------------

    displayWord()
    {
        let s = "";

        for(const c of this.word)
        {
            if(c == " ")
            {
                s += "  ";
            }
            else if(this.used.includes(c))
            {
                s += c + " ";
            }
            else
            {
                s += "_ ";
            }
        }

        return s.trim();
    }

    //------------------------------------------------

    wrongLetters()
    {
        return this.used.filter(
            x => !this.word.includes(x)
        );
    }

    //------------------------------------------------

    correctLetters()
    {
        return this.used.filter(
            x => this.word.includes(x)
        );
    }

    //------------------------------------------------

    unusedLetters()
    {
        let list = [];

        for(const c of this.alphabet)
        {
            if(!this.used.includes(c))
                list.push(c);
        }

        return list;
    }

    //------------------------------------------------

    message()
    {
        switch(this.status)
        {
            case "idle":
                return "Awaiting Prisoner";

            case "playing":
                return "Trial In Progress";

            case "win":
                return "Prisoner Pardoned";

            case "lose":
                return "Sentence Carried Out";
        }

        return "";
    }

    //------------------------------------------------

    state()
    {
        return {

            status : this.status,

            message : this.message(),

            canGuess :
                this.status == "playing",

            category : this.category,

            hint : this.hint,

            display : this.displayWord(),

            attempts : this.remaining,

            maxAttempts : this.maxAttempts,

            hangmanStage :
                this.maxAttempts -
                this.remaining,

            wrong :
                this.wrongLetters(),

            wrongLetters :
                this.wrongLetters(),

            correctLetters :
                this.correctLetters(),

            unusedLetters :
                this.unusedLetters()
        };
    }
}

module.exports = Game;
