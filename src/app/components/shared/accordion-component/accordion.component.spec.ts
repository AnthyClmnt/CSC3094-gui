import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AccordionComponent } from './accordion.component';
import {NgIconsModule} from "@ng-icons/core";
import {heroChevronDown, heroChevronUp} from "@ng-icons/heroicons/outline";

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccordionComponent ],
      imports: [NgIconsModule.withIcons({heroChevronDown, heroChevronUp})],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.title).toEqual('');
    expect(component.isOpen).toBeTrue();
  });

  it('should toggle isOpen when toggle() is called', () => {
    const initialValue = component.isOpen;
    component.toggle();
    expect(component.isOpen).toEqual(!initialValue);

    component.toggle();
    expect(component.isOpen).toEqual(initialValue);
  });
});
