var lodash = require('lodash');

class Dice {
    constructor(values) {
        this.values = values
    }

    roll() {
        return lodash.sample(this.values);
    }
}

module.exports = Dice;
