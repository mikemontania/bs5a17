import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionTotalesComponent } from './seccion-totales.component';

describe('SeccionTotalesComponent', () => {
  let component: SeccionTotalesComponent;
  let fixture: ComponentFixture<SeccionTotalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionTotalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeccionTotalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
