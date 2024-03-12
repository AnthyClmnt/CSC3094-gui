import {Component, Input} from "@angular/core";

@Component({
  selector: 'accordion',
  templateUrl: 'accordion.component.html',
  styleUrls: ['accordion.component.scss']
})
export class AccordionComponent {
  @Input() title: string = '';
  @Input() isOpen: boolean = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

}
