import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NGXBarraHorizontalComponent } from './ngx-charts-barra-horizontal.component';

describe('GraficoBarraHorizontalComponent', () => {
  let component: NGXBarraHorizontalComponent;
  let fixture: ComponentFixture<NGXBarraHorizontalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NGXBarraHorizontalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NGXBarraHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
