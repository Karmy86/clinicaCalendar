import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PodologiaComponent } from './podologia.component';

describe('PodologiaComponent', () => {
  let component: PodologiaComponent;
  let fixture: ComponentFixture<PodologiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PodologiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PodologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
