import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptiveMaintenanceComponent } from './prescriptive-maintenance.component';

describe('PrescriptiveMaintenanceComponent', () => {
  let component: PrescriptiveMaintenanceComponent;
  let fixture: ComponentFixture<PrescriptiveMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptiveMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptiveMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
