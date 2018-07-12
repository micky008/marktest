import { Component } from '@angular/core';
import { Marked } from './marked/index'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  mark: Marked;
  constructor() {
    this.mark = new Marked();
    let tmp: string = "# toto";
    console.log(this.mark.marked(tmp));
  }



}
