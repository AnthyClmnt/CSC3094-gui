import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { GithubAuthCallbackComponent } from './github-auth-callback.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingService } from '../services/loading.service';
import { UserService } from '../services/user-service';
import {BehaviorSubject, of} from 'rxjs';

describe('GithubAuthCallbackComponent', () => {
  let component: GithubAuthCallbackComponent;
  let fixture: ComponentFixture<GithubAuthCallbackComponent>;
  let mockActivatedRoute: BehaviorSubject<any>;
  let mockRouter: any;
  let mockLoadingService: any;
  let mockUserService: any;

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

    await TestBed.configureTestingModule({
      declarations: [GithubAuthCallbackComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParams: mockActivatedRoute } },
        { provide: Router, useValue: mockRouter },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: UserService, useValue: mockUserService }
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

  it('should call connectGitHub method and navigate to "/" after successful connection to GitHub', fakeAsync(() => {
    mockActivatedRoute.next({code: '123'});
    component.ngOnInit();
    tick();

    expect(mockUserService.connectGitHub).toHaveBeenCalledWith('123');
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');
  }));


  it('should navigate to "/github-connect" if code is not present in query params', () => {
    mockActivatedRoute.next({});

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/github-connect');
  });
});
