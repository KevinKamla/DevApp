import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServiceproduitService } from 'src/app/services/produits/serviceproduit.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServicedbService } from 'src/app/services/database/servicedb.service';

@Component({
  selector: 'app-dedailproduct',
  templateUrl: './dedailproduct.page.html',
  styleUrls: ['./dedailproduct.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule],
  providers: [HttpClient, HttpClientModule, ServiceproduitService]
})
export class DedailproductPage implements OnInit {
  idPro: any;
  modalIsOpen: boolean = false;
  produitSelected: any;
  qty: number = 1;
  price: number = 2500;
  seleB = "selected-color";
  seleW = "";
  seleG = "";
  color = "Black";
  cart: any[] = []
  lengthCart: number = 0

  constructor(
    private route: ActivatedRoute,
    private BDservice: ServicedbService,
    private produitService: ServiceproduitService,
    private alert: AlertController,
    private modal: ModalController,
  ) {
    this.route.queryParams.subscribe(params => {
      const value = localStorage.getItem("nbItem")
      value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
      console.log("===== lengthCart ====  : ", value);
    });
  }

  priceGroup = new FormGroup({
    price: new FormControl()
  });

  getProduitSelected() {
    this.produitService.getProduct().subscribe((data: any[any]) => {
      this.produitSelected = data.filter((elt: { id: any }) => elt.id == this.idPro)[0]
    })
  }

  priceForm() {
    let newProduct = {
      "id": this.produitSelected.id,
      "idCategorie":  this.produitSelected.idCategorie,
      "Nom": this.produitSelected.Nom,
      "Prix": this.priceGroup.value.price,
      "Description": this.produitSelected.Description,
      "Photo": this.produitSelected.Photo,
      "Quantite": this.qty,
      "Color": this.color
    }
    this.produitSelected = newProduct
    this.closeModal();
  }

  async addCart(item: any) {
    let obj = {
      "id": item.id,
      "idCategorie": item.idCategorie,
      "Nom": item.Nom,
      "Prix": item.Prix,
      "Description": item.Description,
      "Photo": item.Photo,
      "Quantite": this.qty,
      "Color": this.color
    }
    await this.BDservice.setData("Cart", obj).then(async (res: any) => {
      if (res == "dataExit") {
        await this.replaceAlert("Cart", obj, item)
      }
    });
  }

  async getLengthTab(tabname: string) {
    this.cart = await this.BDservice.getData(tabname);
    this.lengthCart = this.cart?.length;
    localStorage.setItem("nbItem", this.cart?.length.toString() || "0");
    console.log("this.lengthCart : ", this.lengthCart);
  }

  selectedColor(value: string) {
    if (value == "black") {
      this.seleB = "selected-color";
      this.seleW = "";
      this.seleG = "";
      this.color = value

    } else if (value == "white") {
      this.seleW = "selected-color";
      this.seleB = "";
      this.seleG = "";
      this.color = value
    }
    else {
      this.seleG = "selected-color";
      this.seleW = "";
      this.seleB = "";
      this.color = value
    }
  }

  nbProductSubs() {
    if (this.qty > 1) {
      this.qty--
    }
  }

  nbProductAdd() {
    this.qty++
  }

  async replaceAlert(tabName: string, objet: any, item: any) {
    const alert = await this.alert.create({
      message: "Voulez modifier ce produit ?",
      buttons: [
        {
          text: 'Oui',
          handler: async () => {
            await this.BDservice.removeItem(tabName, objet);
            await this.addCart(item);
            await this.getLengthTab("Cart")
          }
        },
        {
          text: 'Non',
        },
      ]
    })
    await alert.present();
  }

  closeModal() {
    this.modal.dismiss();
    this.modalIsOpen = false
  }

  openModal(){
    this.modalIsOpen = true
  }

  ngAfterViewInit() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.idPro = this.route.snapshot.paramMap.get('id');
    this.getProduitSelected();
    const value = localStorage.getItem("nbItem")
    value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
  }

}
