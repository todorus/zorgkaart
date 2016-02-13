global.expect = require('expect');
global.sinon = require('sinon');

// disable logging
//console.log = function() {}

function MockContext(callback) {
    this.successfull = false;
    this.finished = false;

    this.error = null;
    this.response = null;

    this.callback = callback;
}
MockContext.prototype.done = function (error, response) {
    this.finished = true;
    this.successfull = error == null;
    this.error = error;
    this.response = response;

    if(this.callback != undefined && this.callback != null){
        this.callback(this);
    }
}
MockContext.prototype.fail = function (error) {
    this.done(error, null);
}
MockContext.prototype.succeed = function (response) {
    this.done(null, response);
}
MockContext.prototype.then = function(callback){
    this.callback = callback;
}
global.MockContext = MockContext;

it("should run in the test environment", function(){
    expect(process.env.NODE_ENV).toEqual("test");
});