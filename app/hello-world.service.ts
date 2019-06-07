import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// mocking 'environment' for testing:
const environment = { apiUrl: 'http://www.testing.com' };

@Injectable({
  providedIn: 'root'
})
export class HelloWorldService {
  constructor(
    private http: HttpClient
  ) { }

  getHelloWorld(): Observable<any> {
    console.log("Why is the test coming here when I provide a mock?");
    var getHelloWorldApiUrl = environment.apiUrl + "/api/v1.0/helloworld/GetHelloWorldMessageAuth";
    return this.http
    .get(getHelloWorldApiUrl);
  }
}
