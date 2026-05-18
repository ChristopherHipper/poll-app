import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})
export class Logo {
  variant = input();

  imgSrc(){
    return `assets/img/logo/logo-${this.variant()}.png`;
  };
};
