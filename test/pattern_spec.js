var should = require('chai').should();
var Pattern = require('../lib/pattern.js');


describe('Pattern', function() {

    describe('Pattern#formatName', function() {
        it('returns a pattern name', function() {
            var name = Pattern.formatName('01-my-pattern');
            name.should.equal('my-pattern');
        });

        it('converts hypens to spaces', function() {
            var name = Pattern.formatName('01-my-pattern', true);
            name.should.equal('my pattern');
        });

        it('handles 00 pattern names', function() {
            var name = Pattern.formatName('00-my-pattern');
            name.should.equal('my-pattern');
        });

        it('handles no pattern number', function() {
            var name = Pattern.formatName('my-pattern');
            name.should.equal('my-pattern');
        });
    });

});