import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
  
})
export class ServiceproduitService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getLogoGEC(){
    return this.httpClient.get("assets/icon/logoGEC.jpg", { responseType: 'blob' });
  }
  
  getProduct(){
    return this.httpClient.get("assets/jsons/Produit.json");
  }

  getCategorie(){
    return this.httpClient.get("assets/jsons/Categorie.json");
  }
}
