import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';

import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { ReportService } from './services/report.service';
import { Report } from './interfaces/report.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

reportService= inject(ReportService);
report : Report | undefined;


  ngOnInit(): void {
   this.reportService.generateReport().subscribe(report => this.report = report);
  }

    ngOnDestroy(): void {
  }
}