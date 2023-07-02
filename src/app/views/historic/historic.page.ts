import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { ServicedbService } from 'src/app/services/database/servicedb.service';

@Component({
  selector: 'app-historic',
  templateUrl: './historic.page.html',
  styleUrls: ['./historic.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class HistoricPage implements OnInit {

  cart: any
  tabHistory: any[] = [];
  lenghttabhis = 0;
  infoDelete: any;

  constructor(
    private actionSheetController: ActionSheetController,
    private BDservice: ServicedbService,
  ) { }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Voulez vous vraiment vider l'historique ?",
      buttons: [
        {
          text: 'Oui',
          role: 'Delete',
          handler: async () => {
            this.BDservice.remove("ListCart");
            await this.getHistory()
          }
        },
        {
          text: 'Annuler',
          role: 'less',
          handler: () => { console.log('share clicked'); }
        },
      ]
    });
    await actionSheet.present();
  }

  async getHistory() {
    this.tabHistory = await this.BDservice.getData("ListCart");
    this.tabHistory ? this.lenghttabhis = this.tabHistory?.length : this.lenghttabhis = 0
    console.log(this.tabHistory);
  }

  async deleted(item: any) {
    this.BDservice.removeItem("ListCart", item)
    await this.getHistory();
    localStorage.setItem("infoDelete","false");
  }

  async ngOnInit() {
    await this.getHistory();
    this.infoDelete = localStorage.getItem("infoDelete")
  }

}
