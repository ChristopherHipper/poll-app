import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempSurveys } from './temp-surveys';

describe('TempSurveys', () => {
  let component: TempSurveys;
  let fixture: ComponentFixture<TempSurveys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempSurveys]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempSurveys);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
