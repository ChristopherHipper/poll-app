import { Component, signal } from '@angular/core';
import { Logo } from "../../../../shared/logo/logo";
import { PrimaryButton } from "../../../../shared/buttons/primary-button/primary-button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-hero-section',
  imports: [Logo, PrimaryButton, RouterLink],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
}
