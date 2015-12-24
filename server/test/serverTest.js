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
		it("redirects to index page when player is unregistered",function(done){
			request(controller)
				.get('/main.html')
				.expect(302)
				.expect('Location','/index.html',done)
		});
	});
	describe("index page",function(){
		it("redirects player to the waiting page after login from url /",function(done){
			request(controller)
				.post('/')
				.send("name=Suman")
				.expect(302)
				.expect('Location','/waitingPage.html',done);
		});
		it("redirects player to the waiting page after login from url /indexPage.html",function(done){
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
	describe("main.html",function(){
		it("gives a waiting message when more than 4th player want to join the game",function(done){
			request(controller)
				.post('/')
				.send('name=hey')
				.set('Cookie', ['userId=hey'])
				.expect(302)
				.expect('Location','/waitingPage.html')
				.end(function(){
					request(controller)
						.post('/')
						.send('name=Saran')
						.set('Cookie', ['userId=Saran'])
						.expect(302)
						.expect('Location','/waitingPage.html')
						.end(function(){
							request(controller)
								.post('/')
								.send('name=Satyam')
								.set('Cookie', ['userId=Satyam'])
								.expect(302)
								.expect('Location','/waitingPage.html')
								.end(function(){
									request(controller)
										.post('/')
										.send('name=Shivani')
										.set('Cookie', ['userId=Shivani'])
										.expect(302)
										.expect('Location','/waitingPage.html')
										.end(function(){
											request(controller)
												.post('/')
												.send('name=Shivam')
												.set('Cookie', ['userId=Shivam'])
												.expect(200)
												.expect(/Please wait, a game is already started/,done);
										})
								})
						})
				})		
		});
	});
});




