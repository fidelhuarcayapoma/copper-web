import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { PRIME_NG_LANG } from './shared/utils/table.util';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'copper-web';
  private primengConfig = inject(PrimeNGConfig);
  
  ngOnInit() {
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation(PRIME_NG_LANG);

  }


}
