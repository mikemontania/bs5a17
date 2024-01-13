import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltip]', // Selector para usar la directiva en elementos HTML
  standalone: true // Indica que la directiva es independiente y no requiere otro componente
})
export class TooltipDirective {
  @Input() appTooltip: string = ''; // Propiedad de entrada para el mensaje del tooltip

  private tooltipElement: HTMLDivElement | null = null; // Elemento div para el tooltip

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    this.showTooltip(); // Manejador de evento al pasar el ratón sobre el elemento
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.hideTooltip(); // Manejador de evento al retirar el ratón del elemento
  }

  private showTooltip(): void {
    if (!this.tooltipElement) {
      // Crear el elemento div para el tooltip si no existe
      this.tooltipElement = this.renderer.createElement('div');
      this.tooltipElement!.className = 'custom-tooltip'; // Agregar la clase para el estilo del tooltip
      this.tooltipElement!.innerHTML = this.appTooltip; // Establecer el contenido del tooltip

      const parentElement = this.el.nativeElement.parentElement;
      this.renderer.appendChild(parentElement, this.tooltipElement); // Agregar el tooltip al DOM
    }
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      // Eliminar el tooltip si existe
      this.renderer.removeChild(this.el.nativeElement.parentElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
