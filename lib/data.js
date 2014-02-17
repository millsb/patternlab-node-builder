var _ = require('lodash'),
	path = require('path'),
	fs = require('fs'),
	Q = require('q'),
	Pattern = require('./Pattern');


var Data = function(filePath) {
	this.filePath = filePath;
	this.obj = null;
};

Data.prototype = {
	isListItems: function() {
		return this.filePath.indexOf('.listitems') != -1;
	},

	isPartialData: function() {
		return this.filePath.indexOf("~") != -1;	
	},

	patternName: function() {
		var name = Pattern.pathToName(this.filePath, true);
		return Pattern.formatName(name);
	},

	read: function() {
		var defer = Q.defer();
		var self = this;
		fs.readFile(this.filePath, 'utf8', function(err, data) {
			if (err) {
				defer.reject(err);
			} else {
				self.obj = JSON.parse(data);
				defer.resolve(self);
			}
		});

		return defer.promise;
	}
};

module.exports = Data;