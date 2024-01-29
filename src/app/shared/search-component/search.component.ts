import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class SearchComponent {
  @Input() list: any[] = [];
  @Input() searchAttributes: string[] = []
  @Output() searchResult = new EventEmitter<any[]>();

  searchTerm: string = '';

  onSearch(): void {
    if (!this.searchTerm) {
      this.searchResult.emit(this.list); // If search term is empty, emit the entire list
      return;
    }

    const filteredList = this.list.filter(item => {
      if (typeof item === 'string') {
        return item.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.searchAttributes.length > 0 && typeof item === 'object') {
        return this.searchAttributes.some(attribute =>
          item[attribute]
            .toString()
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        );
      } else {
        return this.searchResult.emit(this.list);
      }
    });

    this.searchResult.emit(filteredList);
  }
}
