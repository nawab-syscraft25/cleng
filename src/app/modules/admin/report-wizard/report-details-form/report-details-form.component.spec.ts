import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailsFormComponent } from './report-details-form.component';

describe('ReportDetailsFormComponent', () => {
  let component: ReportDetailsFormComponent;
  let fixture: ComponentFixture<ReportDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
