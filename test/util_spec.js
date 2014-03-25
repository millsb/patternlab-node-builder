var should = require('chai').should();
var Util = require('../lib/util.js');

describe("Util", function() {
    describe('Util#nameClean', function() {
        it('returns a pattern name', function() {
            var name = Util.nameClean('01-my-pattern');
            name.should.equal('my-pattern');
        });

        it('converts hypens to spaces', function() {
            var name = Util.nameClean('01-my-pattern', true);
            name.should.equal('my pattern');
        });

        it('handles 00 pattern names', function() {
            var name = Util.nameClean('00-my-pattern');
            name.should.equal('my-pattern');
        });

        it('handles no pattern number', function() {
            var name = Util.nameClean('my-pattern');
            name.should.equal('my-pattern');
        });
    });
    describe('Util#pathToName', function () {
        it('returns a single pattern name', function () {
            var aPath = 'foo/bar/baz-bat.mustache';
            Util.pathToName(aPath).should.equal("baz-bat");
        });

        it('with includeType, returns a pattern name with type', function() {
            var aPath = 'foo/bar/baz-bat.mustache';
            Util.pathToName(aPath, true).should.equal("foo-baz-bat");
        });

        it('returns a single pattern name when no type provided', function() {
            var aPath = "foo.mustache";
            Util.pathToName(aPath).should.equal('foo');
        });

        it('strips numbers from pattern name', function() {
            var aPath = "molecules/bar/01-foo.mustache";
            Util.pathToName(aPath, true).should.equal("molecules-foo");
        });

        it('strips leading slashes from filename', function() {
        	var aPath = "/molecules/bar/01-foo.mustache";
        	Util.pathToName(aPath, true).should.equal('molecules-foo');
        })
        
    });
});