import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpService } from './http.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  group,
} from '@angular/animations';

const fadeInAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('fadeInAnimation', [
 
        // route 'enter' transition
        transition(':enter', [
 
            // css styles at start of transition
            style({ opacity: 0 }),
 
            // animation and styles at end of transition
            animate('.3s', style({ opacity: 1 }))
        ])
        ])


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [fadeInAnimation],
    host: { '[@fadeInAnimation]': '' }
})

export class AppComponent {


}




