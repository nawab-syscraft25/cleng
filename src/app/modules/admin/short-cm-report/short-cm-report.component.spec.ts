import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortCmReportComponent } from './short-cm-report.component';

describe('ShortCmReportComponent', () => {
  let component: ShortCmReportComponent;
  let fixture: ComponentFixture<ShortCmReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortCmReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortCmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
