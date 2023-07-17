import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ServiceproduitService } from 'src/app/services/produits/serviceproduit.service';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { ServicedbService } from 'src/app/services/database/servicedb.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule],
  providers: [HttpClient, HttpClientModule, ServiceproduitService]
})
export class CategoryPage implements OnInit {


  tabCategory: any[] = []
  cart: any[] = []
  lengthCart: number = 0
  data: any

  constructor(
    private serviceProduit: ServiceproduitService,
    private BDservice: ServicedbService,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.subscribe(params => {
      const value = localStorage.getItem("nbItem")
      value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
      console.log("===== lengthCart ====  : ", value);
    });

  }

  getCategorie() {
    this.serviceProduit.getCategorie().subscribe((data: any) => {
      this.tabCategory = data
    })
  }

  ngAfterViewInit() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.getCategorie()
    const value = localStorage.getItem("nbItem")
    value ? this.lengthCart = parseInt(value) : this.lengthCart = 0
  }


}
