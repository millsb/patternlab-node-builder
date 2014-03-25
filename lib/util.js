var path = require("path"),
    _ = require("lodash");

module.exports = {
    
    nameClean: function(name, dashesToSpaces) {
        var pieces = name.split("-").filter(function(value) {
            return (_.isNaN(parseInt(value), 10));
        });

        var patternName = pieces.join("-");

        if (dashesToSpaces) {
            patternName = patternName.replace('-', " ");
        }

        return patternName;
    },

    pathToName: function(filePath, includeType) {
        filePath = path.normalize(filePath);
        var base = filePath.replace(path.extname(filePath), "");

        // strip leading path separator
        var pattern = new RegExp("^\\" + path.sep);
        base = base.replace(pattern, '');

        var pieces = base.split(path.sep);

        var name = this.nameClean(_(pieces).last());
        var type = this.nameClean(_(pieces).first());

        if (includeType && pieces.length > 1) {
            return type + "-" + name;
        } else {
            return name;
        }
    },

    partialNameMatches: function(filePath, partialName) {
        var score = 0;
        var pathPieces = filePath.split(path.sep);
        var partialPieces = partialName.split('-');

        _.each(partialPieces, function(partialPiece) {
            if (_.indexOf(pathPieces, partialPiece)) {
                score++;
            }
        });

        return score;
    }
};