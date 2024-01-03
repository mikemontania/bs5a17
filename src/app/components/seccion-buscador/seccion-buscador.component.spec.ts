import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionBuscadorComponent } from './seccion-buscador.component';

describe('SeccionBuscadorComponent', () => {
  let component: SeccionBuscadorComponent;
  let fixture: ComponentFixture<SeccionBuscadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionBuscadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeccionBuscadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
