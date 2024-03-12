import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {NgIconsModule} from "@ng-icons/core";
import {heroMagnifyingGlass} from "@ng-icons/heroicons/outline";
import {SearchComponent} from "./search.component";
import {FormsModule} from "@angular/forms";

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponent ],
      imports: [FormsModule, RouterTestingModule, NgIconsModule.withIcons({heroMagnifyingGlass})]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the entire list when search term is empty', () => {
    const list = ['item1', 'item2', 'item3'];
    component.list = list;
    spyOn(component.searchResult, 'emit');

    component.onSearch();

    expect(component.searchResult.emit).toHaveBeenCalledWith(list);
  });

  it('should filter the list based on the search term', () => {
    const list = [
      { name: 'John', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 }
    ];
    component.list = list;
    component.searchAttributes = ['name'];

    spyOn(component.searchResult, 'emit');

    component.searchTerm = 'John';
    component.onSearch();
    expect(component.searchResult.emit).toHaveBeenCalledWith([list[0]]);
  });

  it('should emit the entire list when search term is empty', () => {
    const list = ['item1', 'item2', 'item3'];
    component.list = list;
    component.searchTerm = '';
    spyOn(component.searchResult, 'emit');

    component.onSearch();

    expect(component.searchResult.emit).toHaveBeenCalledWith(list);
  });
});
