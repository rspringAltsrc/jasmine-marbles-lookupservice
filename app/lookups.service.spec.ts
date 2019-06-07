import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { delay } from 'rxjs/operators';

import { LookUpsService } from './lookups.service';
import {
  LookupClient,
  PersonnelClient,
  CustomerClient,
  FieldWorkerType
} from './api';
import { TestScheduler } from 'rxjs/testing';


describe('LookupsService', () => {
  let testScheduler: TestScheduler;
  let sut: LookUpsService;

  let lookupsClient: any;
  let personnelClient: any;
  let customerClient: any;
  let fieldWorkerTypesSpy: any;



  // Using Subscribe
  it('can get fieldWorkerTypes - using expect in subscribe', () => {
    // This works for the most part.

    const values = {
      f: <FieldWorkerType[]>[{ id: 1, description: 'foo' }, { id: 2, description: 'bar' }]
    };

    const source = '--f|';

    fieldWorkerTypesSpy.and.returnValue(cold(source, values));

    // First expect the api has not been called
    expect(lookupsClient.getFieldWorkerTypes).not.toHaveBeenCalled();


    sut.fieldWorkerTypes.subscribe((fieldWorkerTypes) => {
      console.log('expecting');
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(1);
      expect(fieldWorkerTypes[0].id).toBe(1);
    });
  });

  it('shareReplay prevents multiple calls to api - using two subscribers and a delay', () => {
    const values = {
      f: <FieldWorkerType[]>[{ id: 1, description: 'foo' }, { id: 2, description: 'bar' }]
    };

    const source = '--f|';

    fieldWorkerTypesSpy.and.returnValue(cold(source, values));

    // First expect the api has not been called
    expect(lookupsClient.getFieldWorkerTypes).not.toHaveBeenCalled();


    sut.fieldWorkerTypes.subscribe((fieldWorkerTypes) => {
      console.log('expect first');
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(1);
      expect(fieldWorkerTypes[0].id).toBe(1);
    });

    // This appears to work at first glance, but when you open the debug window, you'll see it's throwing errors.
    sut.fieldWorkerTypes.pipe(
      delay(2000)
    ).subscribe((fieldWorkerTypes) => {
      console.log('expect second after delay');
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(1);
      expect(fieldWorkerTypes[0].id).toBe(1);
    });
  });

  it('refreshLookups results in new call to api', () => {
    const values = {
      f: <FieldWorkerType[]>[{ id: 1, description: 'foo' }, { id: 2, description: 'bar' }]
    };

    const source = '--f|';

    fieldWorkerTypesSpy.and.returnValue(cold(source, values));

    // First expect the api has not been called
    expect(lookupsClient.getFieldWorkerTypes).not.toHaveBeenCalled();


    sut.fieldWorkerTypes.subscribe((fieldWorkerTypes) => {
      console.log('expect first');
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(1);
      expect(fieldWorkerTypes[0].id).toBe(1);
    });

    sut.fieldWorkerTypes.subscribe((fieldWorkerTypes) => {
      console.log('expect second');
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(1);
      expect(fieldWorkerTypes[0].id).toBe(1);
    });

    setTimeout(() => {
      console.log('call refresh');
      sut.refreshLookups();
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(3);

      // Throws error that
			/* zone.js:199 Uncaught Error: 'expect' was used when there was no current spec, this could be because an asynchronous test timed out
			* at Env.expect (jasmine.js:1645) [ProxyZone]
			* at expect (jasmine.js:5767) [ProxyZone]
			* at _karma_webpack_/webpack:/src/shared/lookups.service.spec.ts:205:4 [ProxyZone]
			* at ProxyZoneSpec.push.../node_modules/zone.js/dist/zone-testing.js.ProxyZoneSpec.onInvokeTask
			* (_karma_webpack_/webpack:/node_modules/zone.js/dist/zone-testing.js:320) [ProxyZone]
			* at timer (_karma_webpack_/webpack:/node_modules/zone.js/dist/zone.js:2281) [<root>]
			*/

			/* Besides the error, as the test is written with the expect inside the subscription
			* as the way to check how many times lookupsClient.getFieldWorkerTypes has been called,
			* after refreshing, the number of times should go up.  Adding a variable to this tests
			* for such a thing is generally frowned upon, because tests should be easily read without
			* needing to work through logic of iterating numbers.
			*/
    }, 1500);
  });

  // Introducing the TestScheduler....

  it('can get fieldWorkerTypes - using TestScheduler', () => {
    testScheduler.run(helpers => {
      // const { cold, hot, expectObservable, expectSubscriptions, flush } = helpers;

      const values = {
        f: <FieldWorkerType[]>[{ id: 1, description: 'foo' }, { id: 2, description: 'bar' }]
      };

      const source = '--f|';

      fieldWorkerTypesSpy.and.returnValue(cold(source, values));

      // First expect the api has not been called
      expect(lookupsClient.getFieldWorkerTypes).not.toHaveBeenCalled();
      helpers.expectObservable(sut.fieldWorkerTypes).toBe('^-f', values);

      helpers.flush();
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(1);
    });
  });

  // Taking another stab at the two subscribers and the delay
  it('shareReplay prevents multiple calls to api - using TestScheduler', () => {
    testScheduler.run(helpers => {
      const values = {
        f: <FieldWorkerType[]>[{ id: 1, description: 'foo' }, { id: 2, description: 'bar' }]
      };
      const source = '   ----f---------f----|';
      
      const sub1 = '   --^';
      const expect1 = '------f---------f';
      
      const sub2 = '   -----------^';
      const expect2 = '-----------f----f';
      
      const sub3 = '   --------^';
      const expect3 = '--------f-------f';

      fieldWorkerTypesSpy.and.returnValue(cold(source, values));

      // First expect the api has not been called
      expect(lookupsClient.getFieldWorkerTypes).not.toHaveBeenCalled();


      helpers.expectObservable(sut.fieldWorkerTypes, sub1).toBe(expect1, values);
      helpers.expectObservable(sut.fieldWorkerTypes, sub2).toBe(expect2, values);
      helpers.expectObservable(sut.fieldWorkerTypes, sub3).toBe(expect3, values);

      helpers.flush();

      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(1);

      sut.refreshLookups();
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(2);
      sut.refreshLookups();
      sut.refreshLookups();
      sut.refreshLookups();
      sut.refreshLookups();
      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(6);
    });
  });

  it('refreshLookups gets new api values while preserving previous values', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable, flush } = helpers;

      const values = {
        f: <FieldWorkerType[]>[{ id: 1, description: 'foo' }, { id: 2, description: 'bar' }],
        g: <FieldWorkerType[]>[{ id: 3, description: 'baz' }, { id: 4, description: 'qux' }]
      };

      const source1 = '     ----f-|';
      const sub1 = '     --^-------!';
      const expected1 = ' ------f';

      const source2 = '            ----g|';
      //                          --f
      //                           ----g
      const sub2 = '              -^----!';
      const expected2 = '-----------f--g';

      fieldWorkerTypesSpy.and.returnValue(cold(source1, values));

      // First expect the api has not been called
      expect(lookupsClient.getFieldWorkerTypes).not.toHaveBeenCalled();


      expectObservable(sut.fieldWorkerTypes, sub1).toBe(expected1, values);
      flush();


      fieldWorkerTypesSpy.and.returnValue(cold(source2, values));
      sut.refreshLookups();
      expectObservable(sut.fieldWorkerTypes, sub2).toBe(expected2, values);
      flush();

      expect(lookupsClient.getFieldWorkerTypes).toHaveBeenCalledTimes(2);
    });
  });




  beforeEach(() => {
    personnelClient = jasmine.createSpyObj(
      'PersonnelClient',
      [''] // Fill out as needed
    );
    customerClient = jasmine.createSpyObj(
      'CustomerClient',
      [''] // Fill out as needed
    );
    lookupsClient = jasmine.createSpyObj(
      'LookupClient',
      ['getFieldWorkerTypes']
    );

    const fwt$ = cold('');

    fieldWorkerTypesSpy = lookupsClient.getFieldWorkerTypes.and.returnValue(fwt$);

    TestBed.configureTestingModule({
      providers: [{
        provide: LookupClient,
        useValue: lookupsClient
      },
      {
        provide: CustomerClient,
        useValue: customerClient
      },
      {
        provide: PersonnelClient,
        useValue: personnelClient
      }
      ]
    });
    sut = TestBed.get(LookUpsService);
    testScheduler = getTestScheduler();
  });

});
