import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
  selector: 'app-battle',
  templateUrl: './battle.component.html',
  styleUrls: ['./battle.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class BattleComponent implements OnInit {
	enemyPokeSprite = ""
	yourPokeSprite = ""

	
	yourPokemonName = ""
	enemyPokemonName = ""

	yourPokeHp = 23
	enemyPokeHp = 2


	enemypoke: any;
	mypoke: any;

	myVar: any;


	disabled = [true, true, true, true]

    constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  areaPokemon = []
  movelist = ["disabled","disabled","disabled","disabled"]
  area_image = ""
  area = ""
  myPokeLevel: number;
  enemyPokeStats = {};
  enemyPokeLevel: any;
  yourPokeStats = {};
  multipliers = [];
  enemyName = "";
  expvalue = 0;
  moneyvalue = 0;
  enemyMoveList = {"caterpie" : ["Tackle"],
					"weedle" : ["Poison-sting"],
					"pikachu" : ["Tackle", "Thunder-shock"],
					"geodude" : ["Tackle"],
					"zubat" : ["Leech-life"],
					"clefairy" : ["Pound"],
					"voltorb" : ["Tackle"],
					"magnemite" : ["Tackle"],}

  messagequeue = []
  message = ""

  ngOnInit() {
  	let paramobs = this._route.params.subscribe(params =>{
  		this.area = params['area'];
  		console.log(this.area)
  		var level = 0;

  		if(this.area == "forest"){
  			this.areaPokemon = ["caterpie", "weedle", "pikachu"]
  			this.area_image = "https://i635.photobucket.com/albums/uu74/PocketmonmMaster/1_zps5e1a5a12.png"
  			level = 5;
  		}
  		else if(this.area == "mountain"){
  			this.areaPokemon = ["geodude", "zubat", "clefairy"]
  			this.area_image = "https://i635.photobucket.com/albums/uu74/PocketmonmMaster/1_zps5e1a5a12.png"
  			level = 5;
  		}
  		else if(this.area =="power"){
  			this.areaPokemon = ["voltorb", "magnemite", "pikachu"]
  			this.area_image = "https://i635.photobucket.com/albums/uu74/PocketmonmMaster/1_zps5e1a5a12.png"
  			level = 5;
  		}

  		//Must be a better way to do this.

  		this.multipliers["water"] = {"adv" : ["fire", "ground", "rock"], "disadv" : ["water", "grass", "dragon"]}
	  	this.multipliers["fire"] = {"adv" : ["grass", "ice", "bug", "steel"], "disadv" : ["water", "fire", "rock", "dragon"]}
	  	this.multipliers["grass"] = {"adv" : ["water", "ground", "rock"], "disadv" : ["fire", "grass", "poison", "flying", "bug", "dragon"]}
	    this.multipliers["normal"] =  {"adv" : [], "disadv" : ["rock", "steel"], "immune":"ghost"},
	   	this.multipliers["electric"] = { "adv" : ["water", "flying", "rock"], "disadv" :  ["electric", "grass", "dragon"], "immune" : "ground"}
	    this.multipliers["ice"] = {"adv" : ["grass", "ground", "flying", "dragon"], "disadv" : ["fire", "water", "ice", "steel"]}
	    this.multipliers["fighting"] = {"adv" : ["normal", "ice", "rock", "dark", "steel"], "disadv" : ["poison", "flying", "psychic", "bug", "fairy"], "immune" : "ghost"}
	    this.multipliers["poison"] = {"adv" : ["grass", "fairy"], "disadv" : ["poison", "ground", "dragon", "rock", "ghost"], "immune" : "steel"}
	    this.multipliers["ground"] = {"adv" : ["fire", "electric", "poison", "rock", "steel"], "disadv" : ["grass", "bug"]}
	    this.multipliers["flying"] = {"adv" : ["grass", "fighting", "bug"], "disadv" : ["electric", "rock", "steel"]}
	    this.multipliers["psychic"] = {"adv" : [ "fighting", "poison"], "disadv" : ["psychic", "steel"], "immune" : "dark"}
	    this.multipliers["bug"] = {"adv" : ["grass", "psychic"], "disadv" : ["]fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"]}
	    this.multipliers["rock"] = {"adv" : ["fire", "ice", "flying", "bug"], "disadv" : ["fighting", "ground", "steel"]}
	    this.multipliers["ghost"] = {"adv" : ["psychic", "ghost"],  "disadv" : ["dark"], "immune" : "normal"}
	    this.multipliers["dragon"] = {"adv" : ["dragon"],  "disadv" : ["steel"], "immune" : "fairy"}
	    this.multipliers["dark"] = {"adv" : ["psychic", "ghost"],  "disadv" : ["fighting", "dark", "fairy"]}
	    this.multipliers["steel"] = {"adv" : ["ice", "rock", "fairy"],  "disadv" : ["fire", "water", "electric", "steel"]}
	    this.multipliers["fairy"] = {"adv" : ["fighting", "dragon", "dark"],  "disadv" : ["fire", "poison", "steel"]}

  		  	//RNG ROLL A POKEMON FROM LIST 3rd one is rarer
	  	var random = Math.random()
	  	var pokemon = ""
	  	if(random < 0.4){
	  		pokemon = this.areaPokemon[0]
	  		this.expvalue = 5
	  		this.moneyvalue = 4
	  	}
	  	else if(random < 0.8){
	  		pokemon = this.areaPokemon[1]
	  		this.expvalue = 4
	  		this.moneyvalue = 5
	  	}
	  	else{
	  		pokemon = this.areaPokemon[2]
	  		this.expvalue = 7
	  		this.moneyvalue = 7
	  	}

	  	this.enemyName = pokemon;
	  	let obs = this._httpService.getDetails(pokemon);
	  	obs.subscribe(data => {
	  		if((data as any).message == "success"){
	  			this.enemypoke = (data as any).pokemon
	  			this.enemyPokeSprite = (data as any).pokemon.front_sprite
	  			this.enemyPokemonName = this.enemypoke.name.charAt(0).toUpperCase() + this.enemypoke.name.slice(1) + ":"
				let obs2 = this._httpService.getActive();
				  	obs2.subscribe(data => {
				  		if((data as any).message == "success"){
				  			this.myPokeLevel = (data as any).active.level;
				  			for(var i = 0; i < (data as any).active.moves.length; i++){
				  				this.movelist[i] = (data as any).active.moves[i].charAt(0).toUpperCase() + (data as any).active.moves[i].slice(1)
				  				this.disabled[i] = false;
				  			}
				  			
				  			let obs3 = this._httpService.getDetails((data as any).active.name)
				  			obs3.subscribe(data => {
				  				console.log(data)
				  				if((data as any).message == "success"){
				  					this.mypoke = (data as any).pokemon
				  					this.yourPokeSprite = this.mypoke.back_sprite
				  					this.yourPokemonName = this.mypoke.name.charAt(0).toUpperCase() + (data as any).pokemon.name.slice(1) + ":"
				  					console.log(this.yourPokeSprite)
				  					this.initializeBatle(level)


				  				}
					  			else{
					  				this._router.navigate(['/login'])
					  			}
				  			})
				  		}

				  	})
	  		}
	  		else{
	  			this._router.navigate(['/login'])
	  		}
	  	})

	  
  	})

  	//DEFAULT FOREST







  }


  fight(movenumber){
  	console.log(this.movelist[movenumber])
  	let obs = this._httpService.getMove(this.movelist[movenumber].toLowerCase())
  	obs.subscribe(data => {
  		console.log(data)
  		if((data as any).message == "success"){
  			var move = (data as any).move
  			var multiplier = 1
  			if(this.mypoke.type1 == move.type){
  				multiplier = 1.5
  			} 
  			else if (this.mypoke.type2){
  				if(this.mypoke.type2 == move.type){
  					multiplier = 1.5
  				}
  			}


  			console.log(multiplier)
  			multiplier *= this.calculateMultiplier((data as any).move, this.enemyPokeStats)
  			console.log(multiplier)



  			let damage = ((2 * this.myPokeLevel) / 5) + 2
            let power = damage * move.power * this.yourPokeStats["atk"] / this.enemyPokeStats["def"]
            let yourfinalDmg = ((power / 50) + 2) * multiplier
            console.log(yourfinalDmg, "yourdmg")
            

            let obs2 = this._httpService.getMove(this.enemyMoveList[this.enemyName][0].toLowerCase())
            obs2.subscribe(data => {
            	console.log("fetching enemy move")
            	if((data as any).message == "success"){
            		let enemymove = (data as any).move
            		var enemymultiplier = 1;
            		if((this.enemyPokeStats as any).type1 == enemymove.type){
            			enemymultiplier = 1.5
            		}
            		else if((this.enemyPokeStats as any).type2){
            			if((this.enemyPokeStats as any).type2 == enemymove.type){
            				enemymultiplier = 1.5
            			}
            		}

            		let enemydamage = ((2 * this.enemyPokeLevel) / 5) + 2
            		let enemypower = enemydamage * enemymove.power * this.enemyPokeStats["atk"] / this.yourPokeStats["def"]
            		let enemyfinalDmg = ((enemypower / 50 ) + 2) * enemymultiplier
            		console.log(enemyfinalDmg, "enemydmg")

            		if(this.yourPokeStats["speed"] >= this.enemyPokeStats["speed"]){
            			this.messagequeue.push(this.mypoke.name.charAt(0).toUpperCase() + this.mypoke.name.slice(1) + " used " + move.name + "...")
            			if(multiplier > 2){
            				this.messagequeue.push(" ... it was Super Effective!!!")
            			}
            			else if(multiplier < 1){
            				this.messagequeue.push(" ... it wasn't very effective...")
            			}
            			else if(multiplier == 0){
            				this.messagequeue.push(" ... and it had no effect")
            			}
            			this.enemyPokeHp = this.enemyPokeHp - Math.floor(yourfinalDmg)
            			if(this.enemyPokeHp > 0 ){

            				this.messagequeue.push(this.enemyName.charAt(0).toUpperCase() + this.enemyName.slice(1) + " used " + enemymove.name + "...")
	            			if(enemymultiplier > 2){
	            				this.messagequeue.push(" ... it was Super Effective!!!")
	            			}
	            			else if(enemymultiplier < 1){
	            				this.messagequeue.push(" ... it wasn't very effective...")
	            			}
	            			else if(enemymultiplier == 0){
	            				this.messagequeue.push(" ... and it had no effect")
	            			}
	            			this.yourPokeHp = this.yourPokeHp - Math.floor(enemyfinalDmg)
	            			if(this.yourPokeHp <= 0){
	            				this.messagequeue.push(this.yourPokemonName.charAt(0).toUpperCase() + this.yourPokemonName.slice(1) + " has fainted")
	            				this.messagequeue.push('_')
	            			}
	            			if (this.yourPokeHp < 0){
	            				this.yourPokeHp = 0
	            			}
            			}
            			else{
            				if(this.enemyPokeHp < 0){
	            				this.enemyPokeHp = 0
	            			}	
            				this.messagequeue.push(this.enemyName.charAt(0).toUpperCase() + this.enemyName.slice(1) + " has fainted")
            				this.messagequeue.push('_')
            			}
            			

            		}
            		else{
         				this.messagequeue.push(this.enemyName.charAt(0).toUpperCase() + this.enemyName.slice(1) + " used " + enemymove.name + "...")
            			if(enemymultiplier > 2){
            				this.messagequeue.push(" ... it was Super Effective!!!")
            			}
            			else if(enemymultiplier < 1){
            				this.messagequeue.push(" ... it wasn't very effective...")
            			}
            			else if(enemymultiplier == 0){
            				this.messagequeue.push(" ... and it had no effect")
            			}
            			this.yourPokeHp = this.yourPokeHp - Math.floor(enemyfinalDmg)
            			if (this.yourPokeHp < 0){
            				this.yourPokeHp = 0
            			}
	            		if(this.yourPokeHp <= 0){
	            			this.messagequeue.push(this.yourPokemonName.charAt(0).toUpperCase() + this.yourPokemonName.slice(1) + " has fainted")
	            			this.messagequeue.push('_')
	            		}
	            		else{

	            			this.messagequeue.push(this.mypoke.name.charAt(0).toUpperCase() + this.mypoke.name.slice(1) + " used " + move.name + "...")
	            			if(multiplier > 2){
	            				this.messagequeue.push(" ... it was Super Effective!!!")
	            			}
	            			else if(multiplier < 1){
	            				this.messagequeue.push(" ... it wasn't very effective...")
	            			}
	            			else if(multiplier == 0){
	            				this.messagequeue.push(" ... and it had no effect")
	            			}
	            			this.enemyPokeHp = this.enemyPokeHp - Math.floor(yourfinalDmg)
	            			if(this.enemyPokeHp <= 0){
	            				this.messagequeue.push(this.enemyName.charAt(0).toUpperCase() + this.enemyName.slice(1) + " has fainted")
	            				this.messagequeue.push('_')
	            			}
	            			if(this.enemyPokeHp < 0){
	            				this.enemyPokeHp = 0
	            			}	            			
	            		}




            		}

            		

            		console.log("waiting for timer")


            		this.messagequeue.push("")
					this.displayMessages()

            	}
            })

            	
            

  		}else{
  			this._router.navigate(['/login'])
  		}


  	})

  }




  initializeBatle(level){
  	console.log("initializing battle", this.enemypoke)
  	this.enemyPokeStats["hp"] = Math.round(((this.enemypoke.hp + 100) * level) / 100 + 10)
	this.enemyPokeStats["atk"] = Math.round(((this.enemypoke.atk + 100) * level) / 100 + 5)
	this.enemyPokeStats["def"] = Math.round(((this.enemypoke.def + 100) * level) / 100 + 5)
	this.enemyPokeStats["spatk"] = Math.round(((this.enemypoke.spatk + 100) * level) / 100 + 5)
	this.enemyPokeStats["spdef"] = Math.round(((this.enemypoke.spdef + 100) * level) / 100 + 5)
	this.enemyPokeStats["speed"] = Math.round(((this.enemypoke.speed + 100) * level) / 100 + 5)
	this.enemyPokeStats["type1"] = this.enemypoke.type1
	if  (this.enemypoke.type2){
	    this.enemyPokeStats["type2"] = this.enemypoke.type2
	}
	this.enemyPokeHp = this.enemyPokeStats["hp"] 
	this.enemyPokeLevel = level;
	    
	    
	    //SET YOUR POKEMON STATS
	    
	this.yourPokeStats["hp"] = Math.round(((this.mypoke.hp + 100) * this.myPokeLevel) / 100 + 10)
	this.yourPokeStats["atk"] = Math.round(((this.mypoke.atk + 100) * this.myPokeLevel)  / 100 + 5)
	this.yourPokeStats["def"] = Math.round(((this.mypoke.def + 100) * this.myPokeLevel)  / 100 + 5 )
	this.yourPokeStats["spatk"] = Math.round(((this.mypoke.spatk + 100) * this.myPokeLevel)  / 100 + 5 )
	this.yourPokeStats["spdef"] = Math.round(((this.mypoke.spdef + 100) * this.myPokeLevel) / 100 + 5 )
	this.yourPokeStats["speed"] = Math.round(((this.mypoke.speed + 100) * this.myPokeLevel) / 100 + 5 )
	this.yourPokeStats["type1"] = this.mypoke.type1
	if (this.mypoke.type2){
	    this.yourPokeStats["type2"] = this.mypoke.type2
	}
	this.yourPokeHp = this.yourPokeStats["hp"] 

	console.log(this.enemyPokeStats)
	console.log(this.yourPokeStats)

  }

  calculateMultiplier(move, pokemon){
    var multiplier = 1.0
    var adv = []
    var disadv = []
    var types = []
    types.push(pokemon.type1)
    if (pokemon.type2){
        types.push(pokemon.type2)
    }
    for(var i = 0; i < types.length; i++){

        let typeCalcs = this.multipliers[move.type]
        adv = typeCalcs["adv"]
        
        disadv = typeCalcs["disadv"]
        if (typeCalcs["immune"]){
            multiplier = multiplier * this.quickCalc(adv, disadv, types[i], multiplier, typeCalcs["immune"])
        }
        else{
            console.log("adv ", adv, " disadv: ", disadv, "type: ", types[i])
             multiplier = multiplier * this.quickCalc(adv, disadv, types[i], multiplier, "")
            console.log(multiplier)
        }
    }  
    return multiplier;  
  }

  quickCalc(adv, disadv, type, multiplier, immune) {
    var temp = multiplier
    if (adv.includes(type)) {
        console.log(type, "adv",  adv)
        return  2
    }
    else if (disadv.includes(type)) {
        return 0.5
    }
    else if (immune == type){
        return 0
    }
    else{
        return 1
    }

}

  displayMessages(){
  	this.myTimer()
  }
  myTimer()
   {


   	setInterval(()=>{ 
   		this.message = this.messagequeue.shift(); 
   		if (this.message.includes("_")){
   			if(this.enemyPokeHp <= 0){
   				let obs = this._httpService.winBattle(this.expvalue, this.moneyvalue)
   				obs.subscribe(data => {
   					this._router.navigate(['/home'])
   					
   				})
   			}
   			else{
   				this._router.navigate(['/home'])
   			}
   			
   		} 
   	}, 3000)
   }
}
