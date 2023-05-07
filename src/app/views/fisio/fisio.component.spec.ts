import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FisioComponent } from './fisio.component';

describe('FisioComponent', () => {
  let component: FisioComponent;
  let fixture: ComponentFixture<FisioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FisioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FisioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
