import {Component, EventEmitter, HostListener, Input, Output} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SidebarService} from "../../../services/sidebar.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss'],
  animations: [
    trigger('sidebarTrigger', [
      state('open', style({ transform: 'translateX(-1000px)' })),
      state('close', style({ transform: 'translateX(1000px)' })),
      transition('open => close', [
        animate('500ms ease-in'),
      ]),
      transition('close => open', [
        animate('300ms ease-out')
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() animationTriggered = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  isOpen = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      this.animationTriggered = isOpen;
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(_: KeyboardEvent): void {
    if (this.isOpen) {
      this.toggleSidebar();
    }
  }

  toggleSidebar(): void {
    this.isOpen = false;
    this.sidebarService.toggleSidebar();
    this.isOpenChange.emit();
  }
}
