var should = require('chai').should();
var Pattern = require('../lib/pattern.js');


describe('Pattern', function() {

    describe("#new", function() {
        it('returns instance of pattern', function () {
            var pattern = new Pattern('foo/bar');
            pattern.should.be.instanceOf(Pattern);
        });
        it('populates name', function() {
            var pattern = new Pattern('foo/bar');
            pattern.name.should.equal('bar');
        });
        it('strips filepath and mustache extension from name', function(){
            var pattern = new Pattern('/foo/bar/baz.mustache');
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
            var pattern = new Pattern('molecules/bar/foo.mustache');
            pattern.partialName().should.equal('molecules-foo');
        });
        it ('does not return underscores in hidden patterns', function() {
            var pattern = new Pattern('molecules/bar/_foo.mustache');
            pattern.partialName().should.equal('molecules-foo');
        });
    });

    describe("#getTemplate", function() {
        it('reads the template file to a string', function() {
            var pattern = new Pattern('./test/data/source/_patterns/01-molecules/01-components/01-navbar.mustache', 'bar');
            pattern.getTemplate().should.eventually.equal("<p>{{foo}}</p>\n");
        });
        it('reject the promise if file error', function() {
            var pattern = new Pattern('./totally/not/a/path');
            pattern.getTemplate().should.be.rejected;
        });
    });


});