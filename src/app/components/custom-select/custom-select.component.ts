import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.css'
})
export class CustomSelectComponent {
  searchMode: boolean = false;
  @ViewChild('selectInput') selectInput: ElementRef = new ElementRef('');
  @Input() options: any[] = [];
  @Input() textField: string = 'descripcion';
  @Input() valueField: string = 'id';
  @Input() selectedValue: any; // Nueva línea
  @Input() size: 'default' | 'sm' = 'default';
  @Output() selectedOption = new EventEmitter<any>();
  selectedIndex: number = -1;
  private elementRef = inject(ElementRef);
  searchTerm: string = '';
  selectedOptionText: string = '';
  showDropdown: boolean = false;
  private searchTerms = new Subject<string>();  // Observable para el término de búsqueda
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showDropdown && this.searchMode) {
      switch (event.key) {
        case 'ArrowDown':
          this.moveSelection(1, false);
          event.preventDefault();
          break;
        case 'ArrowUp':
          this.moveSelection(-1, false);
          event.preventDefault();
          break;
        case 'Enter':
          this.selectCurrentOption();
          event.preventDefault();
          break;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showDropdown = false;
      this.searchMode = false; // Desactiva el modo de búsqueda al hacer clic fuera del componente
    }
  }
  ngAfterViewInit() {
    if (this.searchMode) {
      this.setFocusOnInput();
    }
    console.log(this.selectedValue)
    // Seleccionar el valor predefinido al inicio
    if (this.selectedValue) {
      const selectedIndex = this.options.findIndex(option => option[this.valueField] == this.selectedValue);
      console.log(this.selectedIndex)
      if (selectedIndex !== -1) {
        this.selectedIndex = selectedIndex;
        // Retrasar la actualización de la vista para evitar ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.selectedOptionText = this.options[selectedIndex][this.textField];
        });
      }
    }
  }



  moveSelection(delta: number, isMouseHover: boolean = false): void {
    const maxIndex = this.filterOptions().length - 1;

    if (isMouseHover) {
      // Actualizar el índice solo si el desplazamiento está permitido
      const hoveredIndex = this.selectedIndex + delta;
      if (hoveredIndex >= 0 && hoveredIndex <= maxIndex && !this.isHoverDisabled(hoveredIndex)) {
        this.selectedIndex = hoveredIndex;
        this.scrollIntoViewIfNeeded();
      }
    } else {
      // Actualizar el índice según el desplazamiento del teclado
      const newIndex = Math.max(0, Math.min(maxIndex, this.selectedIndex + delta));
      if (newIndex !== this.selectedIndex) {
        this.selectedIndex = newIndex;
        this.scrollIntoViewIfNeeded();
      }
    }
  }
  scrollIntoViewIfNeeded(): void {
    const selectedElement = document.querySelector('.select-custom ul li.selected');

    if (selectedElement) {
      const parent = selectedElement.parentElement;

      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const selectedRect = selectedElement.getBoundingClientRect();

        if (selectedRect.bottom > parentRect.bottom) {
          parent.scrollTop += selectedRect.bottom - parentRect.bottom;
        } else if (selectedRect.top < parentRect.top) {
          parent.scrollTop -= parentRect.top - selectedRect.top;
        }
      }
    }
  }


  clearSelection(): void {
    this.selectedIndex = -1;
  }
  // Método para verificar si el hover está deshabilitado en un índice específico
  isHoverDisabled(index: number): boolean {
    return this.searchMode && index === this.selectedIndex;
  }
  selectCurrentOption(): void {
    if (this.selectedIndex !== -1) {
      const selectedOption = this.filterOptions()[this.selectedIndex];
      this.onOptionSelected(selectedOption);
    }
  }
  onOptionSelected(option: any) {
    this.selectedOptionText = option[this.textField];
    this.showDropdown = false;
    this.selectedOption.emit(option);
    this.searchTerm = ''; // Limpiar el término de búsqueda después de seleccionar una opción
    this.searchMode = false;
  }

  filterOptions(): any[] {
    // Si el término de búsqueda está vacío, devuelve la lista completa
    if (!this.searchTerm) {
      return this.options;
    }

    // Filtra las opciones basadas en el término de búsqueda
    return this.options.filter(option =>
      option[this.textField].toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this.searchMode = this.showDropdown;

    // Enfocar el input cuando se abre el dropdown
    if (this.searchMode) {
      this.setFocusOnInput();

      // Si hay opciones disponibles, seleccionar la primera
      if (this.filterOptions().length > 0) {
        this.selectedIndex = 0;
      }
    } else {
      this.selectedIndex = -1; // Reiniciar la selección al cerrar el dropdown
    }
  }

  enableSearch() {
    this.showDropdown = true;
    this.searchMode = true;

    // Desactivar la selección por hover cuando se habilita la búsqueda
    this.clearSelection();

    // Enfocar el input cuando se abre el campo de búsqueda
    this.setFocusOnInput();
  }
  private setFocusOnInput() {
    // Enfocar el input con un pequeño retraso para asegurar que Angular haya actualizado la vista
    setTimeout(() => {
      this.selectInput.nativeElement.focus();
    }, 0);
  }
  // Método para manejar el evento de búsqueda
  onSearch() {
    this.searchTerms.next(this.searchTerm);

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      // Actualiza la lógica de búsqueda asignando los resultados filtrados a 'options'
      this.options = this.filterOptions();
    });
  }
}
