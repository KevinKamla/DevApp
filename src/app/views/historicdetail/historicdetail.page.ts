import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ServicedbService } from 'src/app/services/database/servicedb.service';

@Component({
  selector: 'app-historicdetail',
  templateUrl: './historicdetail.page.html',
  styleUrls: ['./historicdetail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, ReactiveFormsModule]
})
export class HistoricdetailPage implements OnInit {

  idcommand: any;
  tabHistory: any;
  commandSelected: any;
  modalIsOpen: boolean = false;
  t: number = 500;

  constructor(
    private route: ActivatedRoute,
    private BDservice: ServicedbService,
    private modal: ModalController,
  ) { }

  titleForm = new FormGroup({
    intitule: new FormControl(),
    client: new FormControl(),
    adresse: new FormControl(),
    ville: new FormControl(),
  });

  openModal() {
    this.modalIsOpen = true
  }

  closeModal() {
    this.modal.dismiss();
    this.modalIsOpen = false
  }

  async CommandeForm() {
    const info = {
      "intitule": this.titleForm.value.intitule,
      "client": this.titleForm.value.client,
      "adresse": this.titleForm.value.adresse,
      "ville": this.titleForm.value.ville
    }
    await this.BDservice.setData("infoCommand", info)
    this.chargeCart();
    this.modal.dismiss();
  }

  async selectCommand() {
    this.tabHistory = await this.BDservice.getData("ListCart");
    this.commandSelected = this.tabHistory?.filter((elt: { id: any }) => elt.id == this.idcommand)[0]
    // console.log(this.commandSelected);
  }

  async useCart() {
    await this.BDservice.getData("infoCommand").then(async (res: any) => {
      if (!res) {
        this.openModal();
      } else {
        await this.BDservice.remove("Cart")
        this.chargeCart();
      }
    })
  }

  chargeCart() {
    this.commandSelected?.cart?.forEach((item: any) => {
      setTimeout(async () => {
        // await this.BDservice.setData("Cart", item)
        // console.log("item : ", item);
      }, 3000)
    });

    let len = this.commandSelected?.cart?.length
    let count = 0
    let setInter = setInterval(async () => {
      if (len == 0) {
        clearInterval(setInter);
      } else {
        await this.BDservice.setData("Cart", this.commandSelected?.cart[len - 1]);
        count++;
        localStorage.setItem("nbItem",(count).toString())
        len--;
      }
    }, this.t)
  }



  async ngOnInit() {
    this.idcommand = this.route.snapshot.paramMap.get('id');
    await this.selectCommand();

  }

}
