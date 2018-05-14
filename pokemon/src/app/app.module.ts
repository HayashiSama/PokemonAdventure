import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrebattleComponent } from './prebattle/prebattle.component';
import { BattleComponent } from './battle/battle.component';
import { ActiveComponent } from './active/active.component';
import { GachaComponent } from './gacha/gacha.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NewComponent,
    PrebattleComponent,
    BattleComponent,
    ActiveComponent,
    GachaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
