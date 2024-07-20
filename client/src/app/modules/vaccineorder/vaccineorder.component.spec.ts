import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaccineorderComponent } from './vaccineorder.component';

describe('VaccineorderComponent', () => {
  let component: VaccineorderComponent;
  let fixture: ComponentFixture<VaccineorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaccineorderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VaccineorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
