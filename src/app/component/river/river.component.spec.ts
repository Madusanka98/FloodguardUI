import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiverComponent } from './river.component';

describe('RiverComponent', () => {
  let component: RiverComponent;
  let fixture: ComponentFixture<RiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
