import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionCategoriaComponent } from './seccion-categoria.component';

describe('SeccionCategoriaComponent', () => {
  let component: SeccionCategoriaComponent;
  let fixture: ComponentFixture<SeccionCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionCategoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeccionCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
