import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCmReportListComponent } from './full-cm-report-list.component';

describe('FullCmReportListComponent', () => {
  let component: FullCmReportListComponent;
  let fixture: ComponentFixture<FullCmReportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullCmReportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullCmReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
