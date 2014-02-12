var should = require('chai').should(),
	Data = require('../lib/Data');

describe('Data', function () {
	describe('#new', function () {
		it('returns and instance of Data', function () {
			var data = new Data();
			data.should.be.instanceOf(Data);
		});
		it('sets the filePath', function () {
			var data = new Data('my/path');
			data.filePath.should.equal('my/path');
		});
	});
	describe('#isListItems', function () {
		it('detects listitem json files', function () {
			var data = new Data('path/to/my.listitems.json');
			data.isListItems().should.be.true;
		});
		it('does not flub zero indexOf check', function() {
			var data = new Data('.listitems.json');
			data.isListItems().should.be.true;
		});
		
	});
	describe('#patternName', function () {
		it('returns the correct pattern name', function () {
			var data = new Data('00-molecules/01-nav');
			data.patternName().should.equal('molecules-nav');
		});
		
	});
	describe("#read", function() {
		it('reads JSON files, LIKE A BOSS!', function(done) {
			var data = new Data("./test/data/source/_patterns/01-molecules/01-components/01-navbar.json");
			data.read().should.be.fulfilled.then(function() {
				data.obj.foo.should.equal('LIKE A BOSS!');
			}).should.notify(done);
		});
		it('throws exception on file error', function (done) {
			var data = new Data("./wrongpath");
			var fn = function() {
				data.read().should.be.fulfilled.then(function(data) {
				}).should.notify(done);
			};

			fn.should.throw();


		});
	})
});
