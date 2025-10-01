import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWizardComponent } from './report-wizard.component';

describe('ReportWizardComponent', () => {
  let component: ReportWizardComponent;
  let fixture: ComponentFixture<ReportWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
