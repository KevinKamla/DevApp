import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Injectable({
  providedIn: 'root'
})
export class ServicedbService {

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
  ) { }

  async initialize() {
    await this.storage.create();
    await this.storage.defineDriver(CordovaSQLiteDriver)
  }



  insetData(tabName: string, obj: any) {
    this.storage.set(tabName, obj)
  }

  async getData(tabName: string) {
    return await this.storage.get(tabName)
  }

  async isObjectExist(tabName: string, objet: any) {
    let dataExite = await this.getData(tabName)
    if (dataExite) {
      let objetexist = dataExite.filter((elt: { id: any }) => elt.id == objet.id)[0]
      if (objetexist) {
        return 1
      } else {
        return 0
      }
    }
    return
  }

  async setData(tabName: string, objet: any) {
    const dataExite = await this.getData(tabName)
    if (!dataExite) { // Si le tableau des données existant est vide
      let tabStudent: any[] = []
      tabStudent.push(objet)
      this.insetData(tabName, tabStudent)
    } else {
      if (await this.isObjectExist(tabName, objet) == 0) {
        let newTabStudents: any[] = []
        newTabStudents = dataExite
        newTabStudents.push(objet)
        this.insetData(tabName, newTabStudents)
      } else if (tabName != "ListCart" && tabName != "infoCommand") {
        await this.showToast("Produit existant")
        return "dataExit"
      } if (tabName == "infoCommand") {
        await this.remove(tabName)
        await this.setData(tabName,objet)
      }
    }
    return
  }

  async removeItem(tabName: string, item: any) {
    const dataExite = await this.getData(tabName)
    console.log("dataExite ", dataExite);
    let newTabStudents: any[] = dataExite.filter((elt: { id: any }) => elt.id != item.id);
    this.insetData(tabName, newTabStudents)
  }

  async remove(tabName: string) {
    this.storage.remove(tabName)
  }

  async clear() {
    this.storage.clear();
  }

  async showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'top'
    });
    (await toast).present();
  }

}
