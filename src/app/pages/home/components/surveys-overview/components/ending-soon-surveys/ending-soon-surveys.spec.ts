import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndingSoonSurveys } from './ending-soon-surveys';

describe('EndingSoonSurveys', () => {
  let component: EndingSoonSurveys;
  let fixture: ComponentFixture<EndingSoonSurveys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndingSoonSurveys]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndingSoonSurveys);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
