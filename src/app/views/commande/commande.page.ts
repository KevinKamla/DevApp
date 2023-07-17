import { Component, OnInit } from '@angular/core';
// import { File as Files } from '@ionic-native/file/ngx';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule, NavController } from '@ionic/angular';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-commande',
  templateUrl: './commande.page.html',
  styleUrls: ['./commande.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
  providers: []
})

export class CommandePage implements OnInit {
  cart: any[] = [];
  lengthCart: any;
  totalPrice: number = 0;

  constructor(
    private actionSheetController: ActionSheetController,
    private BDservice: ServicedbService,
    public navCtrl: NavController,
  ) {}

  async handleDelete(item: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Confirmation de suppression',
      buttons: [
        {
          text: 'Annuler',
          role: 'Annuler',
          handler: () => { }
        },
        {
          text: 'Confirmer',
          role: 'Delete',
          handler: async () => {
            this.BDservice.removeItem("Cart", item);
            this.cart = this.cart?.filter((elt: { Nom: any }) => elt.Nom != item.Nom)
            this.lengthCart = this.cart?.length;
            localStorage.setItem("nbItem", this.lengthCart.toString() || "0");
            this.totalPrice = 0;
            this.getTotalPrice();
          }
        },
      ]
    });
    await actionSheet.present();
  }

  getTotalPrice() {
    if (this.cart?.length > 0) {
      this.cart?.forEach((item: any) => {
        this.totalPrice += (item.Prix * (item?.Quantite || 1))
        // console.log(this.totalPrice , "+=", (item.Prix ,"**", (item?.Quantite || 1)));
      })
    }
  }

  async getCart() {
    this.cart = await this.BDservice.getData("Cart");
    this.lengthCart = this.cart?.length;
    localStorage.setItem("nbItem", this.cart?.length.toString() || "0");
  }

  async viewFileOption() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Visualisation',
      buttons: [
        {
          text: 'Facture proforma',
          handler: () => {
            this.navCtrl.navigateRoot("printcommande");
            localStorage.setItem("file", "proforma");
          }
        },
        {
          text: 'Devis',
          handler: () => {
            this.navCtrl.navigateRoot("printcommande");
            localStorage.setItem("file", "devis");
          }
        },
        {
          text: 'Facture',
          handler: () => {
            this.navCtrl.navigateRoot("printcommande");
            localStorage.setItem("file", "facture");
          }
        },
      ]
    });

    await actionSheet.present();

  }

  async ionViewDidEnter() {
    this.ionViewWillEnter();
  }

  async ionViewWillEnter() {
    await this.getCart();
    this.totalPrice = 0;
    this.getTotalPrice();
  }

  async ngOnInit() {
    await this.getCart();
    this.totalPrice = 0;
    this.getTotalPrice();
  }

}
