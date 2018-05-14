import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { fadeInAnimation } from '../_animations/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
      animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
  })

export class RegisterComponent implements OnInit {

  constructor(private _httpService: HttpService,
    private _route: ActivatedRoute,
    private _router: Router) { }

  username: any;
  password: any;
  error =  "";

  ngOnInit() {
  }
  cancelButton(){
  	this._router.navigate(['/'])
  }
  registerButton(){
  	let obs = this._httpService.newUser(this.username, this.password);
  	obs.subscribe(data => {
  		console.log(data)
      if((data as any).message == "success"){
        this._router.navigate(['/login'])
      }
      else{
        this.error = "Username already taken"
      }
  	})

  }

}
