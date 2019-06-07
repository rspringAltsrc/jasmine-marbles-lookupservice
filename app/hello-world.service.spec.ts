import { TestBed } from '@angular/core/testing';
import { cold as staticCold, getTestScheduler } from 'jasmine-marbles';
import { delay } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { HelloWorldService } from './hello-world.service';

describe('HelloWorldService', () => {
  let testScheduler: TestScheduler;
  let sut: HelloWorldService;
  let getSpy: any;
  let httpGet: any;

  beforeEach(() => {
    httpGet = jasmine.createSpyObj(['get']);
    getSpy = httpGet.get;

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: HttpClient,
          useValue: httpGet
        }
      ]
    });
    sut = TestBed.get(HelloWorldService);
    testScheduler = getTestScheduler();

  });

  it('can get HellowWorld results', () => {
    testScheduler.run(helpers => {
      const {
        cold,
        hot,
        expectObservable,
        expectSubscriptions,
        flush
      } = helpers;

      const values = { o: 'Hello', p: 'World' }
      
      const source = '     --o--p--|';
      const sub1 = '   ----^';
      const expect1 = '------o--p--|';

      httpGet.get.and.returnValues(cold(source, values));
      expectObservable(sut.getHelloWorld(), sub1).toBe(expect1, values);
      flush();
      
      expect(getSpy).toHaveBeenCalled();
      
      // expect(getSpy).toHaveBeenCalledWith("http://www.testing.com/api/v2.0/helloworld/GetHelloWorldMessageAuth");
      expect(getSpy).toHaveBeenCalledWith("http://www.testing.com/api/v1.0/helloworld/GetHelloWorldMessageAuth");
    });
  });
});