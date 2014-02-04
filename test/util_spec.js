var should = require('chai').should();
var PatternUtil = require('../lib/util.js').PatternUtil;


describe('Util', function() {

    describe('using PatternUtil#patternName', function() {
        it('returns a pattern name', function() {
            var name = PatternUtil.patternName('01-my-pattern');
            name.should.equal('my-pattern');
        });

        it('converts hypens to spaces', function() {
            var name = PatternUtil.patternName('01-my-pattern', true);
            name.should.equal('my pattern');
        });

        it('handles 00 pattern names', function() {
            var name = PatternUtil.patternName('00-my-pattern');
            name.should.equal('my-pattern');
        });

        it('handles no pattern number', function() {
            var name = PatternUtil.patternName('my-pattern');
            name.should.equal('my-pattern');
        });
    });

});