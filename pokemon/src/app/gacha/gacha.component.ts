import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
  selector: 'app-gacha',
  templateUrl: './gacha.component.html',
  styleUrls: ['./gacha.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class GachaComponent implements OnInit {

      constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }
  disabled = false;
  disabledarr = [true, true, true, true]
  error = ""
  pokemon = ""


  ngOnInit() {
  }

  rollGacha(){
  	console.log("hello")
  	let obs = this._httpService.rollNew()
  	obs.subscribe(data => {
  		if((data as any).message == "error"){
  			this.error = "You dont have enough PokeBucks"
  		}
  		else{
  			this.pokemon = (data as any).pokemon
  			this.disabled = true

  		}
  		console.log(data)
  	})

  }
  goHome(){
  	this._router.navigate(['/home'])
  }

}
