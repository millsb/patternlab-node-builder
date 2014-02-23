var Util = require('./util');

var PatternType = function(name, parent) {
    this.name = name;
    this.parentType = parent;
};

PatternType.prototype = {
    titleName: function() {
        return Util.nameClean(this.name, true).toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
    }
};

module.exports = PatternType;