var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    Q = require('q');

var Pattern = function(filePath, type, dataPath) {
    this.filePath = filePath;
    this.data = null;
    this.name = path.basename(filePath, '.mustache');
    this.type = type;
};

// Template should be accessed via getTemplate, as it wraps
// file i/o.
var template = null;

// Define inherited methods
Pattern.prototype = {
    isHidden: function() {
        return this.name.charAt(0) == "_" ? true : false;
    },
    partialName: function() {
        var name = this.name;
        if (this.isHidden()) {
            name = name.replace('_', '');
        }
        return this.type + "-" + name;
    },

    getTemplate: function() {
        return this.read().then(function(results) {
            return results.template;
        });
    },

    read: function() {
        var self = this;
        var defer = Q.defer();

        if (template) {
            defer.resolve({ template: template, obj: this });
        } else {
            fs.readFile(this.filePath, 'utf-8', function(err, data) {
                if (err) {
                    defer.reject(err);
                } else {
                    template = data;
                    defer.resolve({ template: template, pattern: self });
                }
            });
        }

        return defer.promise;

    },

    render: function() {

    }
};




module.exports = Pattern;