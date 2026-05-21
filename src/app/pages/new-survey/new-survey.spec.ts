import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSurvey } from './new-survey';

describe('NewSurvey', () => {
  let component: NewSurvey;
  let fixture: ComponentFixture<NewSurvey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSurvey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSurvey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
