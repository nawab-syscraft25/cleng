import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCmReportDetailComponent } from './full-cm-report-detail.component';

describe('FullCmReportDetailComponent', () => {
  let component: FullCmReportDetailComponent;
  let fixture: ComponentFixture<FullCmReportDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullCmReportDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullCmReportDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
