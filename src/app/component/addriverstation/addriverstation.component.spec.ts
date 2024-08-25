import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddriverstationComponent } from './addriverstation.component';

describe('AddriverstationComponent', () => {
  let component: AddriverstationComponent;
  let fixture: ComponentFixture<AddriverstationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddriverstationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddriverstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
