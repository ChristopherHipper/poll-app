import {Component, input, output, signal} from '@angular/core';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuGroup,
  CdkMenuItemCheckbox,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import { Survey } from '../interface/survey';

@Component({
  selector: 'app-dropdown',
  imports: [CdkMenuTrigger,
    CdkMenu,
    CdkMenuItemCheckbox,],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  categries = signal<string[]>(['Team Activities', 'Health & Wellness','Gaming & Entertainment', 'Education & Learning', 'Lifestyle & Preferences', 'Technology & Innovation'])
  selectedCategory = signal('')
  outputCategory = output<string>()
  isOpen = signal(false);
  type = input('')

  selectCategory(categorie:string){
    this.selectedCategory.set(categorie)
    this.outputCategory.emit(categorie)
  }

}
