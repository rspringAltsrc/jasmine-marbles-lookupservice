import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HelloWorldComponent } from './hello-world.component';
import { HelloWorldService } from './hello-world.service';
import { of } from 'rxjs';

describe('HelloWorldComponent', () => {

  let component: HelloWorldComponent;
  let fixture: ComponentFixture<HelloWorldComponent>;
  let mockHelloWorldService;

  beforeEach(async(() => {
    mockHelloWorldService = jasmine.createSpyObj(['getHelloWorld']);
    TestBed.configureTestingModule({
      imports: [],
      declarations: [HelloWorldComponent]
    });
    TestBed.overrideProvider(HelloWorldService, { useValue: mockHelloWorldService });
    TestBed.compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelloWorldComponent);
    component = fixture.componentInstance;
    mockHelloWorldService.getHelloWorld.and.returnValue(of('Test Message')); // added this line
    fixture.detectChanges();
  });

  it('should create and assign correct value to "helloWorldMessage"', () => {
    expect(component).toBeTruthy();
    expect(component.helloWorldMessage).toEqual('Test Message'); // added this line
  });
});

