import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddriverComponent } from './addriver.component';

describe('AddriverComponent', () => {
  let component: AddriverComponent;
  let fixture: ComponentFixture<AddriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
