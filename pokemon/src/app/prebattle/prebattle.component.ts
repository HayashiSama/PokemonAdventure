import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
  selector: 'app-prebattle',
  templateUrl: './prebattle.component.html',
  styleUrls: ['./prebattle.component.css'],
      animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class PrebattleComponent implements OnInit {

      constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }


  forest = "https://cdn.bulbagarden.net/upload/thumb/8/8c/HGSS_Viridian_Forest-Day.png/120px-HGSS_Viridian_Forest-Day.png"
  mountain = "https://cdn.bulbagarden.net/upload/a/a0/HGSS_Mt._Moon-Morning.png"
  power = "https://cdn.bulbagarden.net/upload/9/99/FL_Power_Plant.png"
  area: string;
  image: string;

  locationFull = ""
  pokemonList = [];

  ngOnInit() {
  	  	let obs = this._route.params.subscribe(params =>{
  		this.area = params['area'];
  		var place = this.area
  		if(this.area == "forest"){

  			this.image = this.forest
  			this.locationFull = "Viridian Forest"
  			this.transition(this._router, place);
  			this.pokemonList=["Cateripie", "Weedle", "Pikachu"]

  			
  		}
  		else if(this.area == "mountain"){
    		this.image = this.mountain
  			this.locationFull = "Mt. Moon"
  			this.transition(this._router, place);
  			this.pokemonList=["Geodude", "Zubat", "Clefairy"]			
  		}
  		else if(this.area =="power"){
  			this.image = this.power
  			this.locationFull = "Power Plant"
  			this.transition(this._router, place);
  			this.pokemonList = ["Voltorb", "Magnemite", "Pikachu"]
  		}
  		
  	})
  }

 

	transition(router, place){
		console.log("hello")
		setTimeout(function(){ router.navigate(['/battle', place])},  5000) 
				  	
	}



}
