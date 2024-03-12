import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GithubAuthCallbackComponent } from './github-auth-callback.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingService } from '../../../services/loading.service';
import { UserService } from '../../../services/user-service';
import {BehaviorSubject, of} from 'rxjs';
import {AuthService} from "../../../services/auth-service";

describe('GithubAuthCallbackComponent', () => {
  let component: GithubAuthCallbackComponent;
  let fixture: ComponentFixture<GithubAuthCallbackComponent>;
  let mockActivatedRoute: BehaviorSubject<any>;
  let mockRouter: any;
  let mockLoadingService: any;
  let mockUserService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockActivatedRoute = new BehaviorSubject<any>({ code: 'testCode' });

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    mockLoadingService = {
      setLoading: jasmine.createSpy('setLoading'),
      deactivateLoading: jasmine.createSpy('deactivateLoading')
    };

    mockUserService = {
      connectGitHub: jasmine.createSpy('connectGitHub').and.returnValue(of({}))
    };

    mockAuthService = {
      getToken: jasmine.createSpy('getToken'),
      clearCache: jasmine.createSpy('clearCache')
    };

    await TestBed.configureTestingModule({
      declarations: [GithubAuthCallbackComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: mockActivatedRoute } },
        { provide: Router, useValue: mockRouter },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubAuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll((done) => {
    done();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setLoading with correct parameters', () => {
    expect(mockLoadingService.setLoading).toHaveBeenCalledWith({
      active: true,
      text: 'Establishing GitHub Connection...',
      overlay: true
    });
  });

  it('should call connectGitHub method and navigate to "/dashboard" after successful connection to GitHub', fakeAsync(() => {
    mockActivatedRoute.next({code: '123'});
    component.ngOnInit();
    tick();

    expect(mockAuthService.clearCache).toHaveBeenCalledWith('githubConnected');
    expect(mockUserService.connectGitHub).toHaveBeenCalledWith('123');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  }));


  it('should navigate to "/github-connect" if code is not present in query params', () => {
    mockActivatedRoute.next({});

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/github-connect');
  });
});
