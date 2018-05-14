import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { fadeInAnimation } from '../_animations/index';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
    animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})
export class LoginComponent implements OnInit {

  constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  username = "";
  password = "";
  error: any;

  ngOnInit() {
  }

  submitButton(){
  	let obs = this._httpService.login(this.username, this.password)
  	obs.subscribe(data => {
  		console.log(data)
  		if((data as any).message == "success"){
  			console.log("success")
  			this._router.navigate(['/home'])
  		}
  		else{
  			this.error = (data as any).details
  		}
  	})
  	console.log(this.username, this.password)
  }

  registerButton(){
  	this._router.navigate(['/register'])
  }

}
