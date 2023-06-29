import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonMenu, IonicModule } from '@ionic/angular';
// import { BLE } from '@ionic-native/ble/ngx';
import '@angular/compiler';

@Component({
  selector: 'app-bluetooth',
  templateUrl: './bluetooth.page.html',
  styleUrls: ['./bluetooth.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  // providers:[BLE],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class BluetoothPage implements OnInit {
  ifScan: boolean = false;
  devices: any[] = [];
  isActive: any;
  valueChecked: any;

  constructor(
    // private ble: BLE,
    public actionSheetController: ActionSheetController,
  ) { }



  async initialize() {
    try {
      // await this.ble.initialize()
    } catch (err) {
      console.log("Erreur d'initialisation : ", err);
    }
  }

  async activer() {
    try {
      // await this.ble.enable()
    } catch (err) {
      console.log("=====Erreur d'activation : ====", err);
    }
  }

  async desactiver() {
    try {
      // await this.ble. disable()
    } catch (err) {
      console.log("====Erreur de désactivation : ====", err);
    }
  }


  toggleChanged(e: any) {
    this.isActive = e.detail.checked;
    this.valueChecked = e.detail.checked;
    if (this.isActive === true) {
      this.activer();
    } else {
      this.desactiver();
    }

  }


  async presentActionSheet(device: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Settings',
      buttons: [
        {
          text: 'Déconnecter',
          role: 'destructive',
          handler: () => {
            // this.ble.disconnect(device.id).then(() => {
            //   console.log('Disconnected');
            // });
          }
        },
        {
          text: 'Oublier',
          icon: 'trash',
          handler: () => { console.log('share clicked'); }
        },
      ]
    });
    await actionSheet.present();
    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  startScan() {
    this.ifScan = true;
    this.devices = [];
    // this.ble.scan([], 5).subscribe((device: any) => this.onDeviceDiscovered(device),);
  }

  onDeviceDiscovered(device: any) {
    console.log('Discovered ' + JSON.stringify(device, null, 2));
    this.devices.push(device);

  }


  connectToDevice(device: any) {
    // this.ble
    //   .connect(device.id)
    //   .subscribe(
        // (peripheral) => this.onConnected(peripheral),
        // (peripheral) => this.onDeviceDisconnected(peripheral)
      // );
  }

  onConnected(peripheral: any) { }
  onDeviceDisconnected(peripheral: any) { }


  ngOnInit() {
  }

}
