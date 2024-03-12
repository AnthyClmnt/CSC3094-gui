import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoadingComponent } from './loading-component.component';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.text).toEqual('Loading...');
    expect(component.overlay).toBeFalse();
  });

  it('should render the provided text', () => {
    const loadingElement: HTMLElement = fixture.nativeElement;
    expect(loadingElement.textContent).toContain('Loading...');
  });

  it('should apply overlay when overlay input is true', () => {
    component.overlay = true;
    fixture.detectChanges();

    const loadingElement: HTMLElement = fixture.nativeElement;
    const overlayElement = loadingElement.querySelector('.loading-overlay');

    expect(overlayElement).toBeTruthy();
  });

  it('should not apply overlay when overlay input is false', () => {
    component.overlay = false;
    fixture.detectChanges();

    const loadingElement: HTMLElement = fixture.nativeElement;
    const overlayElement = loadingElement.querySelector('.loading-overlay');

    expect(overlayElement).toBeFalsy();
  });
});
