import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceproduitService } from 'src/app/services/produits/serviceproduit.service';
import { ServicedbService } from 'src/app/services/database/servicedb.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule],
  providers: [HttpClient, HttpClientModule, ServiceproduitService]
})
export class SearchPage implements OnInit {
  cart: any;
  lengthCart: any;
  listPRoduit: any[] = []
  resultSearch: any[] = []
  display_skeleton: string = "d-n";


  constructor(
    private BDservice: ServicedbService,
    private produitService: ServiceproduitService,
  ) { }


  async addCart(item: any) {
    await this.BDservice.setData("Cart", item);
    await this.getLengthTab("Cart")
  }

  async getLengthTab(tabname: string) {
    this.cart = await this.BDservice.getData(tabname);
    this.lengthCart = this.cart?.length;
    localStorage.setItem("nbItem", this.cart?.length.toString() || "0");
  }

  onSearchChange(ev: any) {
    this.display_skeleton = "d-b";
    if (ev.target.value == "") {
      this.display_skeleton = "d-n";
      this.resultSearch = [];
    } else {
      let val = ev.target.value; //on récupère la saisie de l’utilisateur
      let resultats = this.listPRoduit.filter((item) => {
        let txtNom = item.Nom + ' ' + item.Description;
        return txtNom.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
      this.resultSearch = resultats
    }
  }

  getProduits() {
    this.produitService.getProduct().subscribe((data: any[any]) => {
      this.listPRoduit = data
    })
  }

  ngOnInit() {
    this.getProduits();
  }

}
