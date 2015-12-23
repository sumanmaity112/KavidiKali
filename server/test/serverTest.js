var request = require('superTest');
var controller = require('../routing.js');

describe("get handlers",function(){
	describe("/",function(){
		it("serves index file if '/' is given",function(done){
			request(controller)
				.get('/')
				.expect(200)
				.expect(/Welcome To KavidiKali/,done)
		});
	});
	describe("/index",function(){
		it("serves index file index.html is requested",function(done){
			request(controller)
				.get('/index.html')
				.expect(200)
				.expect(/Welcome To KavidiKali/)
				.expect('content-Type',/text\/html/,done);
		});
	});	
	describe("/waitingPage.html",function(){
		it("serves waitingPage.html file when requested",function(done){
			request(controller)
				.get('/waitingPage.html')
				.expect(200)
				.expect(/You are Successfully logged in/)
				.expect('content-Type',/text\/html/,done);
		});
	});
	describe("",function(){
		it("serves index file if '' is given",function(done){
			request(controller)
				.get('')
				.expect(200)
				.expect(/Welcome To KavidiKali/,done)
		});
	});
	describe("wrong url",function(){
		it("response with status code 404 when file is not present",function(done){
			request(controller)
				.get('/pikachu')
				.expect(404)
				.expect(/Not Found/,done)
		});
	});
	describe("main.html",function(){
		it("redirects to index page when joined player is less than 4 and the player is unregistered",function(done){
			request(controller)
				.get('/main.html')
				.expect(302)
				.expect('Location','/index.html',done)
		});
	});
});












































