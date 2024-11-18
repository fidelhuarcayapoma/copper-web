import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng.imports';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {

}
