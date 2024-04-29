// tooltip.directive.ts

import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() tooltipText: string = 'text';
  private tooltipElement?: HTMLElement;
  private tooltipTimeout: any;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  private createTooltip(): void {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.tooltipText));
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'visibility', 'hidden');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '9999');
    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  public showTooltip(): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement!.getBoundingClientRect();
    const top = rect.bottom; // show along the bottom
    const left = rect.left + (rect.width - tooltipRect.width) / 2;

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'visibility', 'visible');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.tooltipTimeout = setTimeout(() => {
      this.createTooltip();
      this.showTooltip();
    }, 100);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeChild(document.body, this.tooltipElement);
    this.tooltipElement = undefined;
  }
}
