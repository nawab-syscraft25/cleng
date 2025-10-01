import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrgIdListComponent } from './brg-id-list.component';

describe('BrgIdListComponent', () => {
  let component: BrgIdListComponent;
  let fixture: ComponentFixture<BrgIdListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrgIdListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrgIdListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
