import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CommonModule } from '@angular/common';
import { ServicedbService } from './services/database/servicedb.service';
import '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers:[ServicedbService,Storage]
})
export class AppComponent implements OnInit{
  public environmentInjector = inject(EnvironmentInjector);

  constructor(
    private BDservice : ServicedbService,
  ) {}


  ngOnInit() {
    this.BDservice.initialize();
  }
}
