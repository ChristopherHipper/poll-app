import {Component, signal} from '@angular/core';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuGroup,
  CdkMenuItemCheckbox,
  CdkMenuTrigger,
} from '@angular/cdk/menu';

@Component({
  selector: 'app-dropdown',
  imports: [CdkMenuTrigger,
    CdkMenu,
    CdkMenuItemCheckbox,],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  categries = signal<string[]>(['Team Activities', 'Health & Wellness','Gamind & Entertainment', 'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'])
  selectedCategory = signal('')
  isOpen = signal(false);

  selectCategory(categorie:string){
    this.selectedCategory.set(categorie)
  }

}
