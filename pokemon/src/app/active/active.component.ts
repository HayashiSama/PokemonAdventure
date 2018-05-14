import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { fadeInAnimation } from '../_animations/index';


@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.css']
})
export class ActiveComponent implements OnInit {

    constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }


  user: any;
  pokemon: any;
  active: any;

  ngOnInit() {
  	this.getPokemon()

  }

   getPokemon(){
  	let obs = this._httpService.getUser()
  	obs.subscribe(data =>{
  		console.log(data)
  		if((data as any).message == "success"){
  			this.user = (data as any).user
  			this.pokemon = this.user.pokemon
  			for(var i = 0; i < this.pokemon.length; i++){
  				if(this.pokemon[i].selected == true){
  					this.active = this.pokemon[i]
  				}
  			}

  		}
  		else{
  			//this._router.navigate(['/login'])
  		}
  	})
  }

  makeActive(){
  	let obs = this._httpService.makeActive(this.active)
  	obs.subscribe(data =>{
  		console.log(data)

  	})
  }

  showSelected(poke){
  	this.active = poke
  	console.log("Swap")
  }
  goHome(){
  	this._router.navigate(['/home'])
  }

}
