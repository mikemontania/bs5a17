import { Component, Input, Output, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { fromEvent, map } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'input-debounce',
  styles: [`
    .input-group input:focus,
.input-group input:hover {
  box-shadow: 0 0 5px rgba(253, 154, 108, 0.8); /* Cambia el color del borde al hacer hover o focus */
}

.input-group input {
  border-color: #ccc; /* Agregado para establecer un color de borde predeterminado */
}

.input-group:hover input {
  border-color: #fd9a6ce5; /* Cambia el color del borde al hacer hover o focus */
}
.borde {
  border-color: #fd9a6ce5; /* Cambia el color del ícono */
}

.color {

  color:  #fd9a6ce5; /* Cambia el color del ícono */
}


  `],
  template: `
    <div class="input-group" >
            <input type="text" #inputDebounce
                   id="inputDebounce"
                   class="form-control"
                   width="100%"
                   [placeholder] = "placeholder"
                   [(ngModel)] = "inputValue"
                   (ngModelChange) = "inputValue = toUpeCaseEvent($event)" >
                   @if(inputValue && inputValue.length > 0 ){
                    <span   class="input-group-text borde">
                      <i class="bi bi-trash3 color"
                      (click)="clearInput()"></i>
                    </span>
                   }


    </div>
    `
})

export class InputDebounceComponent {
  @Input() placeholder: string = '';
  @Input() delay: number = 1000;
  @Output() value: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputDebounce') inputDebounce!: ElementRef;
  public inputValue: string = '';

  constructor(private elementRef: ElementRef) {
    const eventStream = fromEvent(this.elementRef.nativeElement, 'keyup')
      .pipe(
        map(() => this.inputValue),
        debounceTime(this.delay)
      );

    eventStream.subscribe(input => this.value.emit(input));
  }

  toUpeCaseEvent(evento: string) {
    return evento.toLocaleUpperCase();
  }
  clearInput() {
    this.inputValue = '';
    this.value.emit('')
  }
  enfocar() {
    this.inputDebounce.nativeElement.focus();
  }
}
