import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveysOverview } from './surveys-overview';

describe('SurveysOverview', () => {
  let component: SurveysOverview;
  let fixture: ComponentFixture<SurveysOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveysOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveysOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
