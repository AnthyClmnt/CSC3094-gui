import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { NavBarComponent } from './nav-bar.component';
import { AuthService } from '../../services/auth-service';
import {NgIconsModule} from "@ng-icons/core";
import {heroSquares2x2, heroArrowLeft, heroChartBar, heroCodeBracket, heroBugAnt, heroShieldExclamation, heroCog6Tooth, heroArrowLeftOnRectangle} from "@ng-icons/heroicons/outline";

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgIconsModule.withIcons({heroSquares2x2, heroArrowLeft, heroChartBar, heroCodeBracket, heroBugAnt, heroShieldExclamation, heroCog6Tooth, heroArrowLeftOnRectangle})],
      declarations: [ NavBarComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
      .compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to router events on initialization', () => {
    spyOn(router.events, 'pipe').and.returnValue(of(new NavigationEnd(0, '/', '/')));
    component.ngOnInit();
    expect(router.events.pipe).toHaveBeenCalled();
  });

  it('should call authService.logout() when signOut() is called', () => {
    component.signOut();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should hide links on GitHub pages', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/github-connect');
    expect(component.hideLinksOnGithubPages()).toBeFalse();
  });

  it('should hide links on repository pages', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/repository/exampleOwner/exampleRepo');
    expect(component.hideLinks()).toBeTrue();
  });

  it('should navigate to home page when navigateHome() is called', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.callThrough();
    component.navigateHome();
    expect(navigateSpy).toHaveBeenCalledWith('/');
  });
});
