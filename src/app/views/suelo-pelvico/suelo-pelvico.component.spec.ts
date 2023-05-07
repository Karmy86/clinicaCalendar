import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SueloPelvicoComponent } from './suelo-pelvico.component';

describe('SueloPelvicoComponent', () => {
  let component: SueloPelvicoComponent;
  let fixture: ComponentFixture<SueloPelvicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SueloPelvicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SueloPelvicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
