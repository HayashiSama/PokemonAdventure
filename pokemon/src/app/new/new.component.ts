import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
  animations: [
    trigger('homeState', [

      state('hide', style({
        opacity: 0,
     
      })),
      state('show', style({
        opacity: 1,
      
      })),
      transition('show => hide', animate('100ms ease-out')),
      transition('hide => show', animate('1000ms ease-in'))

    ])
  ]
})


export class NewComponent implements OnInit {

      constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  oak="hide"
  hidden = "hide";
  name = "";
  types =[];
  selected: any;

  ngOnInit() {


  	setTimeout(function(){
  		console.log("hi")
  		this.oak = "show";
  		
  	}, 2000);
  	
  }

  showChoices(){
  	this.oak = "show"
  }

  choosePokemon(){
   	let obs = this._httpService.firstPoke(this.name.toLowerCase())
   	obs.subscribe(data => {
   		console.log(data)
   		this._router.navigate(['/home'])
   	})
  }


  showPoke(poke){
  	console.log(poke)
  	if(poke == this.selected){
  		this.hidden="hide";
  		this.selected = "";
  		this.name = "";
  	}
  	else if(this.oak == "show"){
  		this.hidden="show";
  		this.selected = poke;
  	}
  	

  	
  	this.name = poke;
  	if(poke ==1) {
		this.name = "Bulbasaur";
		this.types = ["Grass", "Poison"]
  	}
  	else if(poke == 4) {
		this.name = "Charmander";
		this.types = ["Fire"]
  	}
  	else if(poke == 7) {
		this.name = "Squirtle";
		this.types = ["Water"]
  	}


  }

}
