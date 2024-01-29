import {Component, Input} from "@angular/core";

@Component({
  selector: 'loading-spinner',
  templateUrl: './loading-component.component.html',
  styleUrls: ['loading-component.component.scss']
})
export class LoadingComponent {
  @Input() text = "Loading...";
  @Input() overlay: boolean = false;
}
