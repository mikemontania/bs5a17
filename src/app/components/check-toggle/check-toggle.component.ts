import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-toggle',
   standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './check-toggle.component.html',
  styleUrls: ['./check-toggle.component.css']
})
export class CheckToggleComponent {
  @Input() isChecked: boolean = false; // The input property

  @Output() toggleCheck = new EventEmitter<void>(); // Event emitter to notify parent

  toggle() {
    this.isChecked = !this.isChecked;   // Toggle the value
    this.toggleCheck.emit();             // Emit the event properly
  }
}
