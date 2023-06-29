import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import { ServiceproduitService } from 'src/app/services/produits/serviceproduit.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.page.html',
  styleUrls: ['./listproduct.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule],
  providers: [HttpClient, HttpClientModule, ServiceproduitService]
})
export class ListproductPage implements OnInit {

  constructor(
    private BDservice: ServicedbService,
    private produitService: ServiceproduitService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      const value = localStorage.getItem("nbItem")
      value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
    });
  }

  idCat: any
  listPRoduit: any[] = []
  cart: any[] = []
  lengthCart: number = 0

  getProduits() {
    if (this.idCat == -1) {
      this.produitService.getProduct().subscribe((data: any[any]) => {
        this.listPRoduit = data
      })
    } else {
      this.produitService.getProduct().subscribe((data: any[any]) => {
        this.listPRoduit = data.filter((elt: { idCategorie: any }) => elt.idCategorie == this.idCat)
      })
    }
  }

  async addCart(item: any) {
    await this.BDservice.setData("Cart", item);
    await this.getLengthTab("Cart")
  }

  async getLengthTab(tabname: string) {
    this.cart = await this.BDservice.getData(tabname);
    this.lengthCart = this.cart?.length;
    localStorage.setItem("nbItem", this.cart?.length.toString() || "0");
  }

  ngAfterViewInit() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.idCat = this.route.snapshot.paramMap.get('id');
    this.getProduits();
    const value = localStorage.getItem("nbItem")
    value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
  }

}
