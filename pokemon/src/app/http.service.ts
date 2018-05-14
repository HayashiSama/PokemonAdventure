import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor(private _http: HttpClient) { }

  newUser(username, password){
  	return this._http.post('/register', {username: username, password: password})
  }
  login(username, password){
  	return this._http.post('/login', {username: username, password: password})
  }
  firstPoke(name){
  	console.log(name)
  	return this._http.post('/firstPokemon', {name: name})
  }
  getUser(){
  	return this._http.get('/getUser')
  }

  getActive(){
  	console.log("getting active")
  	return this._http.get('/active')
  }

  getDetails(name){
  	return this._http.get('/details/' + name)

  }

  getMove(move){
  	return this._http.get('/move/' + move)
  }

  logout(){
  	return this._http.get('/logout')
  }

  winBattle(exp, money){
  	return this._http.put('/battlewin', {exp: exp, money: money})
  }

  makeActive(poke){
  	return this._http.put('/makeactive', {poke: poke})

  }

  rollNew(){
  	return this._http.put('/roll', {})
  }
}
