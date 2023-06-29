import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule, NavController, ToastController, AlertController, Platform } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import * as numberToWords from 'number-to-words';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
// import { ServiceproduitService } from 'src/app/services/produits/serviceproduit.service';


@Component({
  selector: 'app-printcommande',
  templateUrl: './printcommande.page.html',
  styleUrls: ['./printcommande.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
  providers: [FileOpener, File]
})

export class PrintcommandePage implements OnInit {

  @ViewChild('divPrint') divPrint: ElementRef | undefined;
  CurrentFile: any;
  divHeight: any;
  divWidth: any;
  cart: any[] = [];
  lengthCart: any;
  totalPrice: number = 0;
  totalQte: number = 0;
  infoCommand: any;
  numberToWords: string = "";
  idCart: string = "";
  date: any;
  pdf: any;

  constructor(
    public toastCtrl: ToastController,
    private file: File,
    private fileOpener: FileOpener,
    private alert: AlertController,
    private BDservice: ServicedbService,
    // private bdprod: ServiceproduitService, 
  ) {
  }

  async showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    (await toast).present();
  }

  async showModal(file: any, name: any, path: string) {
    const alert = await this.alert.create({
      header: "Options",
      message: "Ouvrir le pdf ? ",
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.fileOpener
              .open(file + name, path)
              ?.then(() => console.log('File is exported'))
              .catch((e) => console.log(e));
          }
        },
        {
          text: 'Non',
        },
      ]
    })
    await alert.present();
  }

  async ionViewWillEnter() {
    this.CurrentFile = localStorage.getItem("file");
    this.idCart = this.generateUniqueId(new Date());
    this.date = moment().format('MMMM DD YYYY');
    await this.getCart();
    await this.getInfoCommand();
    this.getTotalPrice();
  }

  ionViewDidEnter() {
    this.addHistory(false);
  }

  generateUniqueId(date: Date) {
    const randomId = Math.random().toString(20).substring(2, 6).toUpperCase();
    const formattedDate = date.getFullYear().toString()

    return formattedDate + randomId
  }



  getTotalPrice() {
    if (this.cart?.length > 0) {
      this.totalPrice = 0;
      this.cart.forEach((item: any) => {
        this.totalPrice += (item.Prix * (item?.Quantite || 1));
        this.totalQte += item?.Quantite || 1;
      });
      console.log("this.totalPrice : ", this.totalPrice);

      this.numberToWords = numberToWords.toWords(this.totalPrice);
    }
  }

  async getCart() {
    this.cart = await this.BDservice.getData("Cart");
    this.lengthCart = this.cart?.length;
    localStorage.setItem("nbItem", this.cart?.length.toString() || "0");
  }

  async getInfoCommand() {
    const data = await this.BDservice.getData("infoCommand").then((data: any) => {
      data ? this.infoCommand = data[0] : "";
    });
  }


  async addHistory(print: boolean) {

    let obj = {
      "id": this.idCart,
      "infoCommand": this.infoCommand,
      "print": print,
      "totalPrice": this.totalPrice,
      "cart": this.cart
    }
    await this.BDservice.setData("ListCart", obj);
    if (print) {
      this.BDservice.remove("Cart");
      this.BDservice.remove("infoCommand");
      localStorage.setItem("nbItem", "0");
    }else{
      console.log("false");
    }
  }

  async createPdf(file: any) {
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
    const pdfBlock: any = document.getElementById('print-wrapper');

    const body = []
    const header = ['Qte', 'Design', 'P.u(Fcfa)', 'P.T(Fcfa)'];
    body.push(header);
    this.cart?.forEach((item) => {
      const temp = [item?.Quantite || 1, item.Nom, item.Prix, item.Prix * (item?.Quantite || 1)];
      body.push(temp);
    });
    body.push([this.totalQte, "Total", "  -", this.totalPrice])

    try {
      const docDefinition = {
        pageSize: { width: 220, height: pdfBlock.clientHeight },
        // pageSize: 'A5',
        content: [
          {
            text: 'FACTURE PROFORMA ' + this.idCart,
            style: 'header'
          },
          {
            alignmen: 'justify',
            columns: [
              [
                {
                  text: "Prestataire",
                  style: 'presta'
                },
                {
                  text: ' GEC-INFORMATIQUE ' +
                    '\n N°RC/YAO/2014/A/5701 ' +
                    '\n N°CONT: M052217331893P ' +
                    '\n 5544 YAOUNDE ' +
                    '\n TEL: 00(237)693-538-376 ' +
                    '\n contacts@gec-informatique.com',
                  style: 'info'
                },
                {
                  image: 'data:image/jpeg;base64,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',
                  width: 30,
                  height: 20,
                },
              ],
              [
                {
                  text: "Client",
                  style: 'presta'
                },
                {
                  text: this.infoCommand?.client +
                    '\n' + this.infoCommand?.adresse +
                    '\n' + this.infoCommand?.ville,
                  style: 'info'
                },
              ]
            ]
          },
          {
            text: "Intitulé: " + this.infoCommand?.intitule,
            margin: 5,
            fontSize: 6
          },
          {
            style: 'tableExample',
            table: {
              headerRows: 1,
              body
            },
          },
          {
            text: "Arretée, la presente facture pro forma à la somme \nde " + numberToWords + " francs CFA",
            style: "textePrice"
          },
          {
            text: "Merci pour votre confiance",
            style: "conclusion",
            italics: true
          },
          {
            text: this.date,
            style: "conclusion",
          }
        ],
        styles: {
          header: {
            fontSize: 7,
            bold: true,
            margin: 5
          },
          info: {
            fontSize: 5,
          },
          presta: {
            fontSize: 7,
          },
          tableExample: {
            fontSize: 5,
          },
          textePrice: {
            fontSize: 5,
            margin: 3
          },
          conclusion: {
            fontSize: 5,
            // alignment: 'right',
            margin: 3
          }
        }
      }
      this.pdf = pdfMake.createPdf(docDefinition);
      // this.pdf.open();
      this.Download();
    } catch (error) {
      console.log("==============ERRORR ======================= \n\n\n", error);
    }
  }

  Download() {
    this.pdf.getBuffer((buffer: any) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });
      this.file.checkFile(this.file.dataDirectory, 'lastTest.pdf')
        ?.then((res) => {
          this.file
            ?.writeFile(this.file.dataDirectory, 'lastTest.pdf', blob, { replace: true })
            ?.then(async () => {
              this.addHistory(true);
              this.showToast('lastTest' + " Telechargé avec succcès");
              await this.showModal(this.file.dataDirectory, 'lastTest.pdf', 'application/pdf');
            })
        })
        .catch((err) => {
          this.file
            ?.writeFile(this.file.dataDirectory, 'lastTest.pdf', blob)
            ?.then(async () => {
              this.addHistory(true);
              this.showToast('lastTest' + " Telechargé avec succcès");
              await this.showModal(this.file.dataDirectory, 'lastTest.pdf', 'application/pdf');
            })
        });
    })

  }


  ngOnInit() {


  }
}

