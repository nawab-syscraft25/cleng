import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullCmReportComponent } from './full-cm-report.component';

describe('FullCmReportComponent', () => {
  let component: FullCmReportComponent;
  let fixture: ComponentFixture<FullCmReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullCmReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullCmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
