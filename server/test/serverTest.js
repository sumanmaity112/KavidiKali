var request = require('superTest');
var requestHandler = require('../routing.js');
var Game = require('../../javascript/sourceCode/game.js').game;
var sinon = require('sinon');

var game={};
var controller = requestHandler(game);

describe("get handlers",function(){
	// beforeEach(function(){
		// game = new Game([6],5,[1,2,3,4,5,6]);
		// controller = requestHandler(game);
	// });
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
			game={players:{}};
			controller = requestHandler(game);

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
		it("redirects to index page when player is unregistered",function(done){
			request(controller)
				.get('/main.html')
				.expect(302)
				.expect('Location','/index.html',done)
		});
	});
	describe("index page",function(){
		it("redirects player to the waiting page after login from url /",function(done){
			game={players:{}};
			game.createPlayer=function(){};

			controller = requestHandler(game);
			request(controller)
				.post('/')
				.send("name=Suman")
				.expect(302)
				.expect('Location','/waitingPage.html',done);
		});
		it("redirects player to the waiting page after login from url /indexPage.html",function(done){
			game={players:{}};
			game.createPlayer=function(){};
			controller = requestHandler(game);

			request(controller)
				.post('/index.html')
				.expect(302)
				.expect('Location','/waitingPage.html',done);
		});
	});
	describe(" ",function(){
		it("gives method not allowed when the method is other than GET or POST",function(done){
			request(controller)
				.put('/anything')
				.expect(405)
				.expect('Method is not allowed',done);
		});
	});
});

describe("main.html",function(){
	it("gives a waiting message when more than 4th player want to join the game",function(done){
		game={};
		game.players={rocky:{},jacky:{},joy:{},johnny:{}};
		game.createPlayer=function(){};
		controller = requestHandler(game);
		request(controller)
			.post('/').send('name=john')
			.expect(200)
			.expect("Please wait, a game is already started",done);
	});
});




