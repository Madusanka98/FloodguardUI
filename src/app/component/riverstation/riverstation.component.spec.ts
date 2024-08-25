import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiverstationComponent } from './riverstation.component';

describe('RiverstationComponent', () => {
  let component: RiverstationComponent;
  let fixture: ComponentFixture<RiverstationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiverstationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiverstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
