import { Component, OnInit } from '@angular/core';
import { HelloWorldService } from './hello-world.service';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  providers: [HelloWorldService]
})
export class HelloWorldComponent implements OnInit {

  helloWorldMessage: any;
  constructor(private helloWorldService: HelloWorldService) { }

  ngOnInit() {
    this.getHelloWorldMsg();
  }

  getHelloWorldMsg() {
    this.helloWorldService
      .getHelloWorld()
      .subscribe((data) => {
        this.helloWorldMessage = data;
        }, err => this.handleErrorResponse('There was a problem loading the hello world message', err));
  }

  handleErrorResponse(errorMsg: string, error?: any) {
    console.log("There was a problem getting the message");
  }
}


