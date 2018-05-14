import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { fadeInAnimation } from '../_animations/index';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class HomeComponent implements OnInit {

  constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }
  user = {username: "", level: 1, pokemon: [], stamina: 0, money: 0, pokebucks: 0}
  forestCheck = true;
  mountainCheck = true;
  powerCheck = true;
  ngOnInit() {
  	//check if they have pokemon if not, show chooose your pokemon screen
  	this.startCheck()

  	
  }

  startCheck(){
  	let obs = this._httpService.getUser()
  	obs.subscribe(data =>{
  		console.log(data)
  		if((data as any).message == "success"){
  			this.user = (data as any).user
  			if(this.user.level > 0){
  				this.forestCheck  = false;
  			}
  			if(this.user.level > 1){
  				this.mountainCheck = false;
  			}
  			if(this.user.level > 2){
  				this.powerCheck = false;
  			}
  			if((data as any).user.pokemon.length < 1){
  				this._router.navigate(['/new'])
  			}
  		}
  		else{
  			//this._router.navigate(['/login'])
  		}
  	})
  }

  logout(){
  	let obs = this._httpService.logout()
  	obs.subscribe(data => {
  		console.log("Logging Out")
  		this._router.navigate(['/login'])
  	})
  }

  active(){
  	this._router.navigate(['/active'])
  }
  gacha(){
  	this._router.navigate(['/gacha'])
  }
  go(area){
  	this._router.navigate(['/prebattle', area])
  }

}
