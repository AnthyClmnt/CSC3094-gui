import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesPageComponent } from './issues-page.component';
import {RouterTestingModule} from "@angular/router/testing";
import {UserService} from "../../../services/user-service";
import {ActivatedRoute, Router} from "@angular/router";
import {of} from "rxjs";
import {LoadingComponent} from "../../shared/loading-component/loading-component.component";

describe('IssuesPageComponent', () => {
  let component: IssuesPageComponent;
  let fixture: ComponentFixture<IssuesPageComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(() => {
    mockActivatedRoute = {
      params: of({ repoOwner: 'owner', repoName: 'repo' })
    };

    mockRouter = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    mockUserService = jasmine.createSpyObj('UserService', ['getRepoOverview']);

    TestBed.configureTestingModule({
      declarations: [IssuesPageComponent, LoadingComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    });
    fixture = TestBed.createComponent(IssuesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
