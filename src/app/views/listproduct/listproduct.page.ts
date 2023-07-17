import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController, Platform } from '@ionic/angular';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import { ServiceproduitService } from 'src/app/services/produits/serviceproduit.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

const IMAGE_DIR = 'stored-images'
interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-listproduct',
  templateUrl: './listproduct.page.html',
  styleUrls: ['./listproduct.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule],
  providers: [HttpClient, HttpClientModule, ServiceproduitService]
})
export class ListproductPage implements OnInit {
  modalIsOpen: boolean = false;
  projectForm: any;
  idCat: any
  listPRoduit: any[] = []
  listCategorie: any[] = []
  cart: any[] = []
  lengthCart: number = 0
  images: any



  constructor(
    private BDservice: ServicedbService,
    private produitService: ServiceproduitService,
    private route: ActivatedRoute,
    private plt: Platform,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
  ) {
    this.route.queryParams.subscribe(params => {
      const value = localStorage.getItem("nbItem")
      value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
    });

    this.projectForm = new FormGroup({
      // id: new FormControl(),
      idCategorie: new FormControl(),
      Nom: new FormControl(),
      Prix: new FormControl(),
      Description: new FormControl(),
      Photo: new FormControl(),
    });
  }



  openModal() {
    this.modalIsOpen = true
  }

  closeModal() {
    this.projectForm.reset();
    this.modalIsOpen = false
    this.images = ""
  }

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

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    this.images = image.webPath;
  }


  async ProjectFormulaire() {
    let newProduct = {
      "id": this.listPRoduit.length+1,
      "idCategorie": this.projectForm.value.idCategorie,
      "Nom": this.projectForm.value.Nom,
      "Prix": this.projectForm.value.Prix,
      "Description": this.projectForm.value.Description,
      "Photo": this.images,
    }
    this.listPRoduit.push(newProduct);
    this.BDservice.setData("listPRoduit",this.listPRoduit)
    console.log(this.listPRoduit);
    
    this.closeModal()
  }

  ngAfterViewInit() {
    this.ngOnInit();
    this.produitService.getCategorie().subscribe((data: any) => {
      this.listCategorie = data
      console.log(data);
      console.log(this.listPRoduit);

    })
  }

  ngOnInit() {
    this.idCat = this.route.snapshot.paramMap.get('id');
    this.getProduits();
    const value = localStorage.getItem("nbItem")
    value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
  }

}
