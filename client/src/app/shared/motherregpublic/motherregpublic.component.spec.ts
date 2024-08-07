import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherregpublicComponent } from './motherregpublic.component';

describe('MotherregpublicComponent', () => {
  let component: MotherregpublicComponent;
  let fixture: ComponentFixture<MotherregpublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotherregpublicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotherregpublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
