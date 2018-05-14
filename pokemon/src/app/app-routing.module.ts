import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { PrebattleComponent } from './prebattle/prebattle.component';
import { BattleComponent } from './battle/battle.component'
import { ActiveComponent } from './active/active.component'
import { GachaComponent } from './gacha/gacha.component'

const routes: Routes = [
{path: 'register', component: RegisterComponent},
{path: 'login', component: LoginComponent},
{path: 'home', component: HomeComponent},
{path: 'new', component: NewComponent},
{path: 'prebattle/:area', component: PrebattleComponent},
{path: 'battle/:area', component: BattleComponent},
{path: 'active', component: ActiveComponent},
{path: 'gacha', component: GachaComponent},
{path:'**', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
