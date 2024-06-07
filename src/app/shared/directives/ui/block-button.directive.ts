import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[blockButton]',
})
export class BlockButtonDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.el.nativeElement, 'text-align', 'center');
  }
  
}
