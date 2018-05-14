// Require the Express Module
var express = require('express');
var session = require('express-session');

// Create an Express App
var app = express();
var request = require('request');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(session({secret: 'codingdojorocks'}));

var fs = require('fs');


// Require body-parser (to receive post data from clients)

// Integrate body-parser with our App
app.use(bodyParser.json());
// Require path
var path = require('path');
// Setting our Static Folder Directory

// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.use(express.static( __dirname + '/pokemon/dist' ));




//{name: name, moves: [moves], level: level, exp: exp}


mongoose.connect('mongodb://localhost/pokemon');

var UserSchema = new mongoose.Schema({
	username: {type: String, required: true, minlength: 4, unique: true},
	password: {type: String, required: true, minlength: 4},
	stamina: {type: Number, default: 50},
	money: {type: Number, default: 0},
	pokebucks: {type: Number, default: 0},
	pokemon: {type: Array, default: []},
	level: {type: Number, default: 1},
	exp: {type: Number, default: 0}
})

var MoveSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	type: {type: String, required: true},
	power: {type: Number, default: 0},
	damagetype: {type: String}
})


var PokemonSchema = new mongoose.Schema({
	name: {type: String, required: true, unique: true},
	movelist: {type: Array, default: []},
	type1: {type: String, required: true},
	type2: {type: String},
	hp: {type: Number, required: true},
	atk: {type: Number, required: true},
	def: {type: Number, required: true},
	spatk: {type: Number, required: true},
	spdef: {type: Number, required: true},
	speed: {type: Number, required: true},
	front_sprite: {type: String, required: true},
	back_sprite: {type: String, required: true},
	front_shiny: {type: String, required: true},
	back_shiny: { type: String, required: true},


}, {timestamps: true });

//Each player will be {name: name, status: status}


mongoose.model('Pokemon', PokemonSchema)
mongoose.model('User', UserSchema)
mongoose.model('Move', MoveSchema)

var Pokemon = mongoose.model('Pokemon')
var User = mongoose.model('User')
var Move = mongoose.model('Move')

var rollable = ["dratini",  "pikachu", "gastly", "charmander", "squirtle"]

app.post('/register', function(req,res){
	var newUser = new User(req.body)
	console.log(newUser)
	newUser.save( function(err){
		if(err){
			res.json({message: "error", details: "Username / Password must be 4 characters &&  Username must be unique"})
		}
		else{
			res.json({message: "success", details: "user created successfully"})
		}
	})

})	

app.get('/logout', function(req, res){
	req.session.destroy();
	res.json({message:"success"})
})

app.get('/getUser', function(req, res){
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err || !user){
				console.log(err)
				res.json({message:"error", details: "couldnt find user"})
			}
			else{
				res.json({message:"success", user: user})
			}
		})
	} 
	else{
		res.json({message:"error", details: "user is not logged in"})
	}
})

app.get('/active', function(req, res){
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err || !user){
				console.log(err)
				res.json({message:"error", details: "couldnt find user"})
			}
			else{
				for(var i = 0 ; i < user.pokemon.length; i++){
					console.log(user.pokemon[i])
					if(user.pokemon[i].selected == true){
						res.json({message:"success", active: user.pokemon[i]})
						i = user.pokemon.length
					}
				}
				
			}
		})
	}
})

app.get('/move/:move', function(req, res){
	console.log(req.params.move)
	Move.findOne({name: req.params.move}, function(err, move){
		if(err){
			res.json({message:"error"})
		}
		else{
			res.json({message: "success", move: move})
		}
	})
})

app.post('/login', function(req, res){
	if(req.body){
		User.findOne({username: req.body.username}, function(err, user){
			if(err){
				res.json({message: "error", details: "Username or Password is incorrect. Please try again."})
			}
			else if (user){
				if(user.password == req.body.password){
					req.session.userid = user._id
					console.log(req.session.id)

					res.json({message: "success", details: "successfully logged in"})
				}
				else{
					res.json({message: "error", details: "Username or Password is incorrect. Please try again."})

				}
			}
			else{
				res.json({message: "error", details: "Username or Password is incorrect. Please try again."})
			}
		} )
	}
	else{
		res.json({message: "error", details: "Username or Password is incorrect. Please try again."})
	}

})

app.put('/roll', function(req, res){
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err || !user){
				res.json({message: "error", details: "not found"})
			}
			else{
				if(user.pokebucks > 0){
					// user.pokebucks;
					user.save( function(err){
						if(err){
							console.log(err)
						}
						else{

							var num = Math.floor(Math.random() * rollable.length)
							console.log(num)
							console.log(rollable)
							console.log(rollable[num])
							Pokemon.findOne({name: rollable[num]}, function(err, pokemon){


								if(err){
									console.log(err)
								}
								else{
									
									var name = rollable[num];
									var moves = [];
									console.log(pokemon)
									for(var i = 0; i < pokemon.movelist.length; i++){
										if(pokemon.movelist[i].level <= 5 && moves.length < 4){
											moves.push(pokemon.movelist[i].move)
										}
									}
									user.pokemon.push({name: name, moves: moves, level: 5, selected: false, image: pokemon.front_sprite, exp: 0})
									user.save( function(err){
										if(err){
											console.log(err)
										}
										else{
											res.json({message: "success", pokemon: pokemon.front_sprite})
										}

									})

								}
							})
							
						}
					})
				}
				else{
					res.json({message: "error", details: "Not enough PokeBucks"})
				}
				
			}
		})
	}
	else{
		res.json({message: "error", details: "please log in"})
	}
})

app.post('/firstPokemon', function(req, res){
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err || !user){
				res.json({message: "error", details: "error finding user"})
			}
			else{
				let moves =[];

				var image = ""
				if(req.body.name == 'charmander'){
					moves.push('scratch')
					moves.push('ember')
					image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
					
				}
				else if(req.body.name == 'bulbasaur'){
					moves.push('tackle')
					moves.push('vine-whip')
					image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"

				}
				else if(req.body.name == 'squirtle'){
					moves.push('tackle')
					moves.push('bubble')
					image = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
				}

				else{
					res.json({message: "error", details: "error saving"})
				}

				user.pokemon.push({name: req.body.name, moves: moves, level: 5, selected: true, image: image, exp: 0})
				user.markModified('pokemon');
				user.save( function (err){
					if(err){
						res.json({message: "error", details: "error saving"})
					}
					else{
						res.json({message:"success"})
					}
				})
			}
		})
	}
})

app.put('/battlewin', function(req, res){
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err){
				console.log(err)
				res.json({message:error})
			}
			else{
				user.money += req.body.money;
				user.stamina -= 5
				user.exp += req.body.exp
				if(user.exp > 20){
					user.level += 1
					user.pokebucks += 1
					user.stamina += 50
					user.exp -= 20
				}
				for(var i = 0; i < user.pokemon.length; i++){
					if(user.pokemon[i].selected == true){
						user.pokemon[i].level += 1
					}
				}
				user.markModified('pokemon')
				user.save( function(err){
					if(err){
						res.json({message: "error", details: err})

					}
					else{
						res.json({message:"success"})
					}
				})
				
			}
		})


	}
})

app.put('/makeactive', function(req, res){
	console.log(req.body.poke)
	if(req.body.selected == true){
		console.log("already active")
		res.json({message: "success"})
	}
	if(req.session.userid){
		User.findOne({_id: req.session.userid}, function(err, user){
			if(err || !user){
				console.log(err)
				res.json({message:"error"})
			}
			else{
				for(var i = 0; i < user.pokemon.length; i++){
					console.log("for loop")
					console.log(req.body.poke, " vs " , user.pokemon[i])
					if(req.body.poke.name == user.pokemon[i].name && req.body.poke.level == user.pokemon[i].level){
						console.log("match")
						user.pokemon[i].selected = true
						i = user.pokemon.length;
					}
					else{
						console.log("no match")
						user.pokemon[i].selected = false
					}
				}
				user.markModified('pokemon')
				user.save( function(err) {
					if(err){
						console.log("err")
					}
					else{
						res.json({message: "success"})
					}
				})

			}

		})
	}
})


app.get('/init', function(req, res) {
	console.log(("in init"))
	// for(var i = 1; i < 152; i++){
	// 	request('https://pokeapi.co/api/v2/pokemon/' + i, function(error, response, body) {
	// 		var poke = JSON.parse(body)
	// 		var newPoke = new Pokemon();
	// 		console.log(poke.name)
	// 		newPoke.name = poke.name;

	// 		if(poke.types.length > 1){
	// 			newPoke.type1 = poke.types[1].type.name;
	// 			newPoke.type2 = poke.types[0].type.name;
	// 		}else{
	// 			newPoke.type1 = poke.types[0].type.name;
	// 		}


	// 		newPoke.hp = poke.stats[5].base_stat
	// 		newPoke.atk =  poke.stats[4].base_stat
	// 		newPoke.def =  poke.stats[3].base_stat
	// 		newPoke.spatk =  poke.stats[2].base_stat
	// 		newPoke.spdef =  poke.stats[1].base_stat
	// 		newPoke.speed =  poke.stats[0].base_stat

	// 		newPoke.front_sprite = poke.sprites.front_default;
	// 		newPoke.back_sprite = poke.sprites.back_default;
	// 		newPoke.front_shiny = poke.sprites.front_shiny;
	// 		newPoke.back_shiny = poke.sprites.back_shiny;

	// 		for(var j = 0; j < poke.moves.length; j++){
	// 			//using Red/Blue levelups
	// 			if(poke.moves[j].version_group_details[0].move_learn_method.name == "level-up"){
	// 				newPoke.movelist.push({move: poke.moves[j].move.name, level: poke.moves[j].version_group_details[0].level_learned_at})
	// 			}
	// 		}

	// 		newPoke.save( function(err){
	// 			if(err){
	// 				console.log("error saving pokemon ", newPoke.name)
	// 			}
	// 			else{
	// 				console.log("saved", newPoke.name)
	// 			}
	// 		})	
        
 //    });
	// }

});

app.get('/details/:name' , function(req, res){
	console.log(req.params.name)
	Pokemon.findOne({name: req.params.name}, function(err, pokemon){
		if(err){
			res.json({message: "error", details: "error fetching pokemon name " + req.params.name})
		}
		else{
			res.json({message:"success", pokemon: pokemon})
		}
	})


})

app.get('/moves', function(req, res){
	res.render('Not enabled')
	// for(var i = 350; i < 400; i++){
	// 	request('https://pokeapi.co/api/v2/move/' + i, function(error, response, body) {

	// 		var move = JSON.parse(body)
	// 		var newMove = new Move();
	// 		newMove.name = move.name
	// 		newMove.type = move.type.name
	// 		newMove.power = move.power
	// 		newMove.damagetype = move.damage_class.name
	// 		console.log(newMove.damagetype)
	// 		newMove.save( function(err, res){
	// 			if(err){
	// 				console.log("error " + newMove.name)
	// 			}
	// 			else{
	// 				console.log("added " + newMove.name)
	// 			}
	// 		})
			
	// 	})
	// }

})

app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./pokemon/dist/index.html"))
});

app.listen(8000, function() {
    console.log("listening on port 8000");
})