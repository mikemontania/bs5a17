import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ng-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ng-modal.component.html',
  styleUrl: './ng-modal.component.css'
})
export class NgModalComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() isOpen = false;
  @Input() titulo = '';
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
