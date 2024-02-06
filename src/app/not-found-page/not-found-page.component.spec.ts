import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotFoundPageComponent } from './not-found-page.component';
import { Location } from '@angular/common';
import {NgIconsModule} from "@ng-icons/core";
import {heroFaceFrown} from "@ng-icons/heroicons/outline";

describe('NotFoundPageComponent', () => {
  let component: NotFoundPageComponent;
  let fixture: ComponentFixture<NotFoundPageComponent>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const locationSpyObj = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [ NotFoundPageComponent ],
      providers: [ { provide: Location, useValue: locationSpyObj } ],
      imports: [NgIconsModule.withIcons({heroFaceFrown})]
    })
      .compileComponents();

    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call location.back() when goBack() is called', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
