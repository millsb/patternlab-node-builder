var should = require('chai').should();
var Pattern = require('../lib/pattern.js');


describe('Pattern', function() {

    describe("#new", function() {
        it('returns instance of pattern', function () {
            var pattern = new Pattern('foo', 'bar');
            pattern.should.be.instanceOf(Pattern);
        });
        it('populates name and type', function() {
            var pattern = new Pattern('foo', 'bar');
            pattern.name.should.equal('foo');
            pattern.type.should.equal('bar');
        });
        it('strips filepath and mustache extension from name', function(){
            var pattern = new Pattern('/foo/bar/baz.mustache', 'bat');
            pattern.name.should.equal('baz');
        });
    });
    describe("#isHidden", function() {
        it('returns true with underscore prefix', function() {
            var pattern = new Pattern('_foo');
            pattern.isHidden().should.be.true;
        });
        it('returns false without underscore prefix', function() {
            var pattern = new Pattern('foo');
            pattern.isHidden().should.be.false;
        });
    });

    describe("#partialName", function() {
        it('returns hyphenated combination of name and type', function() {
            var pattern = new Pattern('foo', 'molecules');
            pattern.partialName().should.equal('molecules-foo');
        });
        it ('does not return underscores in hidden patterns', function() {
            var pattern = new Pattern('_foo', 'molecules');
            pattern.partialName().should.equal('molecules-foo');
        });
    });

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
    describe('Pattern:#pathToName', function () {
        it('returns a single pattern name', function () {
            var aPath = 'foo/bar/baz-bat.mustache';
            Pattern.pathToName(aPath).should.equal("baz-bat");
        });

        it('with includeType, returns a pattern name with type', function() {
            var aPath = 'foo/bar/baz-bat.mustache';
            Pattern.pathToName(aPath, true).should.equal("foo-baz-bat");
        });

        it('returns a single pattern name when no type provided', function() {
            var aPath = "foo.mustache";
            Pattern.pathToName(aPath).should.equal('foo');
        });
        
    });

});