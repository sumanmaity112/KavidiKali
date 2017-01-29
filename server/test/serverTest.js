	var request = require('superTest');
var assert = require('assert');
var requestHandler = require('../routing.js');
var Game = require('../../javascript/sourceCode/game.js');
var sinon = require('sinon');
var game={players:{},id:'123456789'};
var games={};
games={};
games['123546789']=game;
var controller = requestHandler(games);
describe("get handlers",function(){
	describe("/",function(){
		it("serves index file if '/' is given",function(done){
			request(controller).get('/')
				.expect(200)
				.expect(/KavidiKali Game/,done)
		});
	});
	describe("/index.html",function(){
		it("serves index file index.html is requested",function(done){
			request(controller).get('/index.html')
				.expect(200)
				.expect(/KavidiKali Game/)
				.expect('content-Type',/text\/html/,done);
		});
	});	
	describe("/waitingPage.html",function(){
		it("serves waitingPage.html file when get request from registered player",function(done){
			game={players:{rocky:{}},id:'123456789'};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);

			request(controller)
				.get('/waitingPage.html')
				.set('cookie',['userId=rocky;gameId=123546789'])
				.expect(200)
				.expect(/<div class="waiting_dots" id="dot_0">/)
				.expect('content-Type',/text\/html/,done);
		});
		it("redirects to index.html when get request from unregistered player",function(done){
			game={players:{rocky:{}},id:'123456789'};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);

			request(controller)
				.get('/waitingPage.html')
				.set('cookie',['userId=rock;gameId=123546789'])
				.expect(302)
				.expect('Location','/index.html',done);
		});
	});
	describe("Empty URL",function(){
		it("serves index file if '' is requested",function(done){
			request(controller).get('')
				.expect(200)
				.expect(/KavidiKali Game/,done);
		});
	});
	describe("wrong url",function(){
		it("response with status code 405 when file is not present",function(done){
			request(controller).get('/pikachu')
				.expect(405)
				.expect("Method is not allowed",done);
		});
	});
	describe("unallowed method",function(){
		it("gives method not allowed when the method is other than GET or POST",function(done){
			request(controller)
				.put('/anything')
				.expect(405)
				.expect("Method is not allowed",done);
		});
	});
	describe("kavidiKali.html",function(){
		it("redirects to index page when joined player is less than 4 and the player is unregistered",function(done){
			request(controller).get('/kavidiKali.html')
				.expect(302)
				.expect('Location','/index.html',done);
		});
		it("redirects to index page when joined player is less than 4 and the player is invalid one",function(done){
			var game = {
				players:{rocky:{},
						 rony:{}
						},
				id:123546789
			};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);

			request(controller).get('/kavidiKali.html')
				.set('cookie',['userId=rincy;gameId=123546789'])
				.expect(302)
				.expect('Location','/index.html',done);
		});
		it("serves kavidiKali.html if all the players are joined and the requester is a valid player",function(done){
			var game = {
				players:{rocky:{},
						 rony:{},
						 rincy:{},
						 rinto:{}
						},
				id:123546789,
				isFull : function(){
					return true;
				}
			};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);

			request(controller).get('/kavidiKali.html')
				.set('cookie',['userId=rincy;gameId=123546789'])
				.expect(200)
				.expect(/<title>Kavidikali<\/title>/,done);
		});
		it("redirects to waitingPage if a registered player request kavidiKali.html before all players joined",function(done){
			var game = {
				players:{rocky:{},
						 rony:{},
						 rincy:{}
						},
				id:123546789,
				isFull : function(){
					return false;
				}
			};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);

			request(controller).get('/kavidiKali.html')
				.set('cookie',['userId=rincy;gameId=123546789'])
				.expect(302)
				.expect('Location','/waitingPage.html',done);	
		});
	});
	describe("enquiry ",function(){
		describe("currentPlayer",function(){
			beforeEach(function(){
				game={players:{},id:123546789};
				game.players={rocky:{},jacky:{},joy:{},rony:{}};
				game.currentPlayer = 'rony'
				games={};
				games['123546789']=game;
				controller = requestHandler(games);
			});

			it("gives the name of current player when it get request from registered player",function(done){
				request(controller)
					.get('/enquiry?question=currentPlayer')
					.set('cookie',['userId=rony;gameId=123546789'])
					.expect(200)
					.expect('rony',done);
			});
			it("gives the status code 405 when it get request from unregistered player",function(done){
				request(controller)
					.get('/enquiry?question=currentPlayer')
					.set('cookie',['userId=roy'])
					.expect(405)
					.expect('Method is not allowed',done);
			});
		});
		describe("isGameOver",function(){
			it("informs player that game is over",function(done){
				game={
					players:{rocky:{isWin:true},
							 rony:{}
							},
					winner:'rocky',
					id:123546789
				};
				game.resetGame = function(){}
				games={};
				games['123546789']=game;
				controller = requestHandler(games);
				request(controller)
					.get('/enquiry?question=isGameOver')
					.set('cookie',['userId=rony;gameId=123546789'])
					.expect('true')
					.expect(200,done);
			});
		});
		describe("myNameAndColor",function(){
			it("gives the name and coin colour of the requester",function(done){
				game={
					players:{rocky:{coinColor:'red'},
							 rony:{}
							},
					id:123546789
				};
				games={};
				games['123546789']=game;
				controller = requestHandler(games);

				request(controller)
					.get('/enquiry?question=myNameAndColor')
					.set('cookie',['userId=rocky;gameId=123546789'])
					.expect('rocky\nYour coin color : red')
					.expect(200,done);
			});
		});
		describe("whatIsMyDetails",function(){
			it("gives the name of the requester",function(done){
				game={
					players:{rocky:{}},
					id:123546789
				};
				games={};
				games['123546789']=game;
				controller = requestHandler(games);

				request(controller)
					.get('/enquiry?question=whatIsMyDetails')
					.set('cookie',['userId=rocky;gameId=123546789'])
					.expect('{"name":"rocky","gameId":123546789}')
					.expect(200,done);
			});
		});
		describe("movesWhere",function(){
			it("gives the valid moves position",function(done){
				game={
					players:{rocky:{
						coins:{
							rocky1:{currentPosition:'0,0'}
						},
						path:[]
					}},
					getAllValidMovesOfCoin : function(){
						return ['2,3','3,4'];
					},
					id:123546789
				};
				games={};
				games['123546789']=game;
				controller = requestHandler(games);
				request(controller)
					.get('/enquiry?question=movesWhere&coin=rocky1')
					.set('cookie',['userId=rocky;gameId=123546789'])
					.expect('["2,3","3,4"]')
					.expect(200,done);
			});
			it("returns 405 when it get request from unregistered player",function(done){
				game={
					players:{rocky:{
						coins:{
							rocky1:{currentPosition:'0,0'}
						},
						path:[]
					}},
					getAllValidMovesOfCoin : function(){
						return ['2,3','3,4'];
					},
					id:123546789
				};
				games={};
				games['123546789']=game;
				controller = requestHandler(games);
				request(controller)
					.get('/enquiry?question=movesWhere&coin=rocky1')
					.set('cookie',['userId=john;gameId=123546789'])
					.expect('Method is not allowed')
					.expect(405,done);
			});
		});		
	});
	describe("whoIsTheWinner",function(){
		it("gives back the name of winner in the game",function(done){
			game={
				players:{rocky:{},
						 rony:{}
						},
				winner:'rocky',
				id:123546789,
				resetGame:function(){}
			};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			var expectedCookie = ['userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
								'gameId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'].join();
			request(controller)
				.get('/enquiry?question=whoIsTheWinner')
				.set('cookie',['userId=rony;gameId=123546789'])
				.expect('rocky')
				.expect('set-cookie',expectedCookie)
				.expect(200,done);
		});
	});
	describe("update",function(){
		it("updates dice values when it gets request from valid player",function(done){
			game={players:{},id:123546789};
			var rocky = {diceValues:[5]};
			game.players={rocky:rocky,jacky:{},joy:{},johnny:{}};
			game.setChances=function(){};
			game.nextPlayer=function(){};
			game.currentPlayer = 'rocky';
			game.dice = {};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=diceValues')
				.set('cookie',['userId=rocky;gameId=123546789'])
				.expect('[5]')
				.expect(200,done)
		});
		it("doesn't updates dice values when it gets request from invalid player",function(done){
			game={players:{},id:123546789};
			var rocky = {rollDice:function(dice){return 5;},chances:0,
						 diceValues:[5]};
			game.players={rocky:rocky,jacky:{},joy:{},johnny:{}};
			game.setChances=function(){};
			game.nextPlayer=function(){};
			game.currentPlayer = 'rocky';
			game.dice = {};
			game.dice.roll = sinon.stub().returns(5);
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=diceValues')
				.set('cookie',['userId=rocy;gameId=123546789'])
				.expect('Method is not allowed')
				.expect(405,done)
		});
		it("updates the list of players when it gets request from valid player",function(done){
			game={players:{},id:123546789};
			game.players={jacky:{},joy:{},johnny:{}};
			game.isFull = function(){
				return false;
			};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=waitingPage')
				.set('cookie',['userId=jacky;gameId=123546789'])
				.expect('["jacky","joy","johnny"]')
				.expect(200,done)

		});
		it("gives out falsey value but statusCode 200 if all the players have joined the game",function(done){
			game={players:{},id:123546789};
			game.players={jacky:{},joy:{},johnny:{},jisna:{}};
			game.isFull = function(){
				return true;
			};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=waitingPage')
				.set('cookie',['userId=jacky;gameId=123546789'])
				.expect('')
				.expect(200,done)

		});
		it("gives 405 when it gets request from an invalid player",function(done){
			game={players:{},id:123546789};
			game.players={jacky:{},joy:{},johnny:{}};
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=waitingPage')
				.set('cookie',['userId=jack;gameId=123546789'])
				.expect('Method is not allowed')
				.expect(405,done)
		});
		it("gives current state of the game when it gets request from valid player",function(done){
			game={players:{},id:123546789};
			game.players={jacky:{},joy:{},johnny:{},rocky:{}};
			game.stateOfGame = function(){
				return {id:'jacky',coins:{jacky1:{currentPosition:'2,0'}}}
			}
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=board')
				.set('cookie',['userId=jacky;gameId=123546789'])
				.expect('{"id":"jacky","coins":{"jacky1":{"currentPosition":"2,0"}}}')
				.expect(200,done)

		});
		it("gives 405 when it gets update board request from invalid player",function(done){
			game={players:{},id:123546789};
			game.players={jacky:{},joy:{},johnny:{},rocky:{}};
			game.stateOfGame = function(){
				return {id:'jacky',coins:{jacky1:{currentPosition:'2,0'}}}
			}
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=board')
				.set('cookie',['userId=jack;gameId=123546789'])
				.expect('Method is not allowed')
				.expect(405,done)
		});
		it("returns the current notification when it get request from registered player",function(done){
			game={players:{},id:123546789};
			game.players={jacky:{},joy:{},johnny:{},rocky:{}};
			game.notification_text="joy got 2"
			game.getNotification=function(){return this.notification_text}
			games={};
			games['123546789']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/update?toUpdate=notification')
				.set('cookie',['userId=jacky;gameId=123546789'])
				.expect(200)
				.expect('joy got 2',done)
		});
	});
	describe("enquiry?question=playerTurn",function(){
		game={players:{},id:123546789};
		game.players={jacky:{},joy:{},johnny:{},rocky:{}};
		games={};
		games['123546789']=game;
		controller = requestHandler(games);
		it("returns the players turn number as 4 when get request from 1st player",function(done){
			request(controller)
				.get('/enquiry?question=playerTurn')
				.set('cookie',['userId=jacky;gameId=123546789'])
				.expect('4')
				.expect(200,done)
		});
		it("returns the players turn number as 3 when get request from 2nd player",function(done){
			request(controller)
				.get('/enquiry?question=playerTurn')
				.set('cookie',['userId=joy;gameId=123546789'])
				.expect('3')
				.expect(200,done)
		});
		it("returns the players turn number as 2 when get request from 3rd player",function(done){
			request(controller)
				.get('/enquiry?question=playerTurn')
				.set('cookie',['userId=johnny;gameId=123546789'])
				.expect('2')
				.expect(200,done)
		});
		it("returns the players turn number as 1 when get request from 4th player",function(done){
			request(controller)
				.get('/enquiry?question=playerTurn')
				.set('cookie',['userId=rocky;gameId=123546789'])
				.expect('1')
				.expect(200,done)
		});
		it("gives 405 when it get request from unregistered player",function(done){
			request(controller)
				.get('/enquiry?question=playerTurn')
				.set('cookie',['userId=jack;gameId=123546789'])
				.expect('Method is not allowed')
				.expect(405,done)
		});
	});
	describe("myInfo",function(){
		it("gives stringified object of winner",function(done){
			game={
					players:{rocky:{colour:"red",id:"rocky",coins:{}},
							 rony:{colour:"yellow",id:"rony",coins:{}}
							},
					winner:'rocky',
					id:123546789,
					resetGame:function(){}
				};
				games={};
				games['123546789']=game;
			var controller = requestHandler(games)
			request(controller)
			.get('/enquiry?question=myInfo')
			.set('cookie',['userId=rocky;gameId=123546789'])
			.expect('{"colour":"red","id":"rocky","coins":{}}')
			.expect(200,done);
		});
		it("gives stringified object of the winner",function(done){
			game={
					players:{rocky:{colour:"red",id:"rocky",coins:{}},
							 rony:{colour:"yellow",id:"rony",coins:{}}
							},
					winner:'rony',
					id:123546789,
					resetGame:function(){}
				};
				games={};
				games['123546789']=game;
			var controller = requestHandler(games)
			request(controller)
			.get('/enquiry?question=myInfo')
			.set('cookie',['userId=rony;gameId=123546789'])
			.expect('{"colour":"yellow","id":"rony","coins":{}}')
			.expect(200,done);
		});
	});
	describe("availableGame",function(){
		it("gives the all available game where a player can join",function(done){
			var game1={players:{},id:123546789,numberOfPlayers:4};
			game1.players={jacky:{},joy:{},johnny:{}};
			var game2={players:{},id:123546780,numberOfPlayers:4};
			game2.players={jack:{},john:{},johnny:{}};
			var game3={players:{},id:123546781,numberOfPlayers:4};
			game3.players={jack:{},john:{},johnny:{},jacky:{}};
			games={};
			games['123546789']=game1;
			games['123546780']=game2;
			games['123546781']=game3;
			controller = requestHandler(games);
			request(controller)
				.get('/availableGame')
				.expect(200)
				.expect('{"123546780":["jack","john","johnny"],"123546789":["jacky","joy","johnny"]}',done)
		});
	});

});

describe("POST handlers",function(){
	describe("index page",function(){
		it("redirects player to the waiting page after login from url /",function(done){
			game={players:{},id:"123846789"};
			game.createPlayer=function(){
				game.players.rony = {coinColor:'red'};
			};
			game.isFull=function(){
				return false;
			};

			games={};
			games['123846789']=game;
			controller = requestHandler(games);
			request(controller)
				.post('/login')
				.send("name=rony&option=joinGame&gameId=123846789")
				.expect('set-cookie','userId=rony; Path=/,gameId=123846789; Path=/')
				.expect(302)
				.expect('Location','/waitingPage.html',done)
		});
		it("redirects player to the waiting page after login from url /indexPage.html",function(done){
			game={players:{},id:'123846789'};
			game.createPlayer=function(){
				game.players.rony = {coinColor:'red'};
			};
			game.isFull=function(){
				return false;
			};
			games={};
			games['123846789']=game;
			controller = requestHandler(games);

			request(controller)
				.post('/login')
				.send("name=rony&option=joinGame&gameId=123846789")
				.expect('set-cookie','userId=rony; Path=/,gameId=123846789; Path=/')
				.expect(302)
				.expect('Location','/waitingPage.html',done)
		});
		it("doesn't create a new game when a new player want to join game till 4th player",function(done){
			var games={};
			var game={
				players:{rock:{},jack:{},johnny:{}},
				createPlayer:function(){},
				id:'123546789'
			};
			game.isFull=function(){
				return false;
			};
			var games={'123546789':game};
			controller = requestHandler(games);
			request(controller)
				.post('/login')
				.send('name=rose&option=joinGame&gameId=123546789')
				.expect('set-cookie',['userId=rose; Path=/'])
				.end(function(req,res){
					var expectCookie = 'gameId=123546789; Path=/'
					assert.equal(expectCookie,res.header['set-cookie'][1]);
					done();
				})
		});
		it("create new game if there no game is present",function(){
			var controller = requestHandler({});
			request(controller)
				.post('/login')
				.send('name=rose&option=newGame')
				.end(function(req,res){
					assert.equal('/waitingPage.html',res.header.location);
					assert.equal(302,res.status)
					done();
				})	
		});
		it("redirects the player to indexPage if he/she want to join the game one of the previously joined players name",function(done){
			var games={};
			var game={
				players:{rock:{},jack:{},johnny:{}},
				id:'123546789',
				isFull : function(){
					return false;
				}
			};
			var games={'123546789':game};
			controller = requestHandler(games);
			request(controller)
				.post('/login')
				.send('name=rock&gameId=123546789&option=joinGame')
				.expect(302)
				.expect('Location','/index.html',done)
		});
		it("allow to join a new player to a specific game when it get a valid gameId",function(done){
			var game={
				players:{rock:{},jack:{},johnny:{}},
				createPlayer:function(){},
				id:'123546789',
				isFull : function(){
					return false;
				}
			}
			var games={'123546789':game};
			controller = requestHandler(games);
			request(controller)
				.post('/login')
				.send('name=rocky&gameId=123546789&option=joinGame')
				.expect(302)
				.expect('Location','/waitingPage.html')
				.expect('set-cookie','userId=rocky; Path=/,gameId=123546789; Path=/',done)
		});
		it("redirects to index page if the game trying to join is full",function(done){
			var game={
				players:{rock:{},jack:{},johnny:{},joy:{}},
				createPlayer:function(){},
				id:'123546789',
				isFull : function(){
					return true;
				}
			}
			var games={'123546789':game};
			controller = requestHandler(games);
			request(controller)
				.post('/login')
				.send('name=rocky&gameId=123546789&option=joinGame')
				.expect(302)
				.expect('Location','/index.html')
				.end(done);
		});
	});
	describe("doInstruction",function(){
		it("performs action roll dice get from registered player",function(done){
			game={players:{},id:123546789};
			var rocky = {rollDice:function(dice){return 5;},chances:1};
			game.players={rocky:rocky,jacky:{},joy:{},johnny:{}};
			game.setChances=function(){};
			game.nextPlayer=function(){};
			game.currentPlayer = 'rocky';
			game.dice = {};
			game.dice.roll = sinon.stub().returns(5);
			games={};
			games['123sahbj']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/instruction?action=rollDice')
				.set('cookie',['userId=rocky;gameId=123sahbj'])
				.expect('5')
				.expect(200,done);
		});
		it("doesn't performs action roll dice get from unregistered player",function(done){
			game={players:{},id:123546789};
			var rocky = {rollDice:function(dice){return 5;},chances:1};
			game.players={rocky:rocky,jacky:{},joy:{},johnny:{}};
			game.setChances=function(){};
			game.nextPlayer=function(){};
			game.currentPlayer = 'rocky';
			game.dice = {};
			game.dice.roll = sinon.stub().returns(5);
			games={};
			games['1235JUk']=game;
			controller = requestHandler(games);
			request(controller)
				.get('/instruction?action=rollDice')
				.set('cookie',['userId=piku;gameId=1235JUk'])
				.expect('Method is not allowed')
				.expect(405,done);
		});
		it("performs action moveCoin if instruction is got from right player and right coin with right position",function(done){
			game={players:{},id:123546789};
			var rocky = {moveCoin:sinon.spy(),chances:1};
			game.players={rocky:rocky,jacky:{},joy:{},johnny:{}};
			game.currentPlayer = 'rocky';
			game.anyMoreMoves = sinon.stub().returns(true);

			game.dice = {};
			game.dice.roll = sinon.stub().returns(5);
			games={};

			games['1235JUk']=game;
			var controller = requestHandler(games);
			request(controller)
				.get('/instruction?action=moveCoin&coin=rocky1&position=76')
				.set('cookie',['userId=rocky;gameId=1235JUk'])
				.expect(200,function(){
					assert(rocky.moveCoin.called);
					assert(rocky.moveCoin.withArgs('rocky1','76').called);
					done();
				});
		});
		it("performs action moveCoin if instruction is got from right player and right coin with right position and nextPlayer is called",function(done){
			game={players:{},id:123546789};
			var rocky = {moveCoin:sinon.spy(),chances:1};
			game.players={rocky:rocky,jacky:{},joy:{},johnny:{}};
			game.currentPlayer = 'rocky';
			game.nextPlayer = sinon.spy();
			game.anyMoreMoves = sinon.stub().returns(false);

			game.dice = {};
			game.dice.roll = sinon.stub().returns(5);
			games={};

			games['1235JUk']=game;
			var controller = requestHandler(games);
			request(controller)
				.get('/instruction?action=moveCoin&coin=rocky1&position=76')
				.set('cookie',['userId=rocky;gameId=1235JUk'])
				.expect(200,function(){
					assert.ok(rocky.moveCoin.called);
					assert.ok(rocky.moveCoin.withArgs('rocky1','76').called);
					assert.ok(game.nextPlayer.called);
					done();
				});
		});
		it("says wrong player if any player requests for instruction other than currentPlayer",function(done){
			game={players:{},id:123546789};
			var rocky = {moveCoin:sinon.spy(),chances:1};
			game.players={rocky:rocky,jacky:{},joy:{},johnny:{}};
			game.currentPlayer = 'rocky';
			game.nextPlayer = sinon.spy();
			game.anyMoreMoves = sinon.stub().returns(false);

			game.dice = {};
			game.dice.roll = sinon.stub().returns(5);
			games={};

			games['1235JUk']=game;
			var controller = requestHandler(games);
			request(controller)
				.get('/instruction?action=moveCoin&coin=rocky1&position=76')
				.set('cookie',['userId=jacky;gameId=1235JUk'])
				.expect('Wrong Player')
				.expect(200,done);
		});
	});
});

