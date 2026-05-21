import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Surveys } from '../../shared/service/surveys';

@Component({
  selector: 'app-survey',
  imports: [],
  templateUrl: './survey.html',
  styleUrl: './survey.scss',
})
export class Survey {
  router = inject(Router);
  private route = inject(ActivatedRoute)
  surveys = inject(Surveys)

  ngOnInit() {
    const currentid = this.route.snapshot.paramMap.get('id');
    if (!currentid) return;
  };

}
