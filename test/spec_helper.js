global.expect = require('expect');
global.sinon = require('sinon');

function MockContext() {
    this.successfull = false;
    this.finished = false;

    this.error = null;
    this.response = null;
}
MockContext.prototype.done = function (error, response) {
    this.finished = true;
    this.successfull = error == null;
    this.error = error;
    this.response = response;
}
MockContext.prototype.fail = function (error) {
    this.done(error, null);
}
MockContext.prototype.succeed = function (response) {
    this.done(null, response);
}
global.MockContext = MockContext;


//beforeEach(function(){
//    // clear database
//});
//afterEach(function(){
//
//});