import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCmReportModalComponent } from './main-cm-report-modal.component';

describe('MainCmReportModalComponent', () => {
  let component: MainCmReportModalComponent;
  let fixture: ComponentFixture<MainCmReportModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCmReportModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCmReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
