import { Component } from '@angular/core';
import { PRIMENG_MODULES } from '../../primeng.imports';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {

}
