var superTest = require('superTest');
// var controller = require('../routing.js');
var agent = superTest.agent();

var request = null;



describe("get handlers",function(){
	beforeEach(function(){
		request = superTest(require('../routing.js'));
	});
	describe("/",function(){
		it("serves index file if '/' is given",function(done){
			request.get('/')
				.expect(200)
				.expect(/Welcome To KavidiKali/,done)
		});
	});
	describe("/index",function(){
		it("serves index file index.html is requested",function(done){
			request.get('/index.html')
				.expect(200)
				.expect(/Welcome To KavidiKali/)
				.expect('content-Type',/text\/html/,done);
		});
	});	
	describe("/waitingPage.html",function(){
		it("serves waitingPage.html file when requested",function(done){
			request.get('/waitingPage.html')
				.expect(200)
				.expect(/You are Successfully logged in/)
				.expect('content-Type',/text\/html/,done);
		});
	});
	describe("",function(){
		it("serves index file if '' is given",function(done){
			request.get('')
				.expect(200)
				.expect(/Welcome To KavidiKali/,done)
		});
	});
	describe("wrong url",function(){
		it("response with status code 404 when file is not present",function(done){
			request.get('/pikachu')
				.expect(404)
				.expect(/Not Found/,done)
		});
	});
	describe("main.html",function(){
		it("redirects to index page when joined player is less than 4 and the player is unregistered",function(done){
			request.get('/main.html')
				.expect(302)
				.expect('Location','/index.html',done)
		});
	});
});


describe("post handlers",function(){
	beforeEach(function(){
		request = superTest(require('../routing.js'));
	});
	describe("index.html",function(){
		it("creates a player with given name",function(done){
			request.post('/index.html')
				.send('name=sooraj')
				.expect(302)
				.expect('Location','/waitingPage.html',done)
		});
	});	
	describe("/",function(){
		it("creates a player with given name",function(done){
			request.post('/')
				.send('name=syanima')
				.expect(302)
				.expect('Location','/waitingPage.html',done)
		});
	});
	describe("wrong url",function(){
		it("returns method not allowed for not allowed method",function(done){
			request.post('/syanima')
				.expect(405,done)
		});
	});
	describe("instruction",function(){
		describe('rollDice',function(){
			it("returns method not allowed for instruction from unregistered user",function(done){
				request
					.post('/instruction/action=rollDice')
					.set('cookie',['userId=arya'])
					.expect(405,done)
				
			});
			it("returns 200 and wrongPlayer for rollDice instruction from registered user but not his turn",function(done){
				request
					.post('/index.html')
					.send('name=sooraj')
					.expect('headers','set-cookie','userId=sooraj')
					.expect(302,function(err, res){
						request
							.post('/instruction/action=rollDice')
							.set('cookie',['userId=syanima'])
							.expect(/Wrong Player/,done)
							.expect(200,done)
					});	
			});
			it("returns 200 and dice value for rollDice instruction from registered user",function(done){
				request
					.post('/index.html')
					.send('name=saran')
					.expect('headers','set-cookie','userId=saran')
					.expect(302,function(err, res){
							request
								.post('/index.html')
								.send('name=shibi')
								.expect('headers','set-cookie','userId=shibi')
								.expect(302,function(err, res){
									request
										.post('/instruction/action=rollDice')
										.set('cookie',['userId=sooraj'])
										.expect(/diceValue/)
										.expect(200,done)
							});
					});	
			});
		})
	});
});











































