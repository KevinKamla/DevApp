import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule]
})
export class ProjectPage implements OnInit {

  @ViewChild('dateDepart') dateDepart: any;
  @ViewChild('dateArrive') dateArrive: any;

  modalIsOpen: boolean = false;
  listProject: any[] = [];
  number = 20;
  tabHistory: any[] = [];
  lenghttabhistory: number = 0;
  tasks: string[] = [""]
  task: string = ""
  projectForm: any;

  constructor(
    private modal: ModalController,
    private serviceBD: ServicedbService,
    private alertCtrl: AlertController,
  ) {
    this.projectForm = new FormGroup({
      intitule: new FormControl(),
      dateDepart: new FormControl(),
      dateArrive: new FormControl(),
      associateCommand: new FormControl(),
      tasks: new FormArray([]),
    });

    this.fetchData()
  }



  openModal() {
    this.modalIsOpen = true
  }

  closeModal() {
    this.projectForm.reset();
    this.tasks = [""]
    this.modalIsOpen = false
  }

  generateUniqueId(date: Date) {
    const randomId = Math.random().toString(20).substring(4, 8).toUpperCase();
    const formattedDate = date.getFullYear().toString()
    return formattedDate + randomId
  }

  async handleDeleteProject(item: any) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Confirmation',
      message: 'Confirmez la suppression du projet '+item.intitule,
      buttons: [
        {
          text: "Non",
          role: 'leave',
          cssClass: 'secondary',
          handler: async () => { }
        },
        {
          text: "Oui",
          role: 'delete',
          cssClass: 'danger',
          handler: async () => { await this.deleted(item) }
        }
      ]
    });
    await alert.present();
  }



  async deleted(item: any) {
    this.serviceBD.removeItem("projects", item);
    await this.fetchData();
    await this.fetchData();
  }

  removeTask(item: string) {
    this.tasks = this.tasks?.filter((elt: string) => elt != item);
    console.log(this.tasks);
  }

  async ProjectFormulaire() {
    this.tasks.push(this.task)
    this.removeTask("");
    let taskFinal: any[] = []
    this.tasks.forEach(item => {
      taskFinal.push(
        {
          elt: item,
          priority: "",
          autor: "",
          progress: 0
        }
      )
    })

    console.log(taskFinal);

    if (this.dateDepart.value?.split("T") != undefined && this.dateArrive.value?.split("T") != undefined) {
      const info = {
        "id": this.generateUniqueId(new Date()),
        "intitule": this.projectForm.value.intitule,
        "dateStart": this.dateDepart.value?.split("T"),
        "dateEnd": this.dateArrive.value?.split("T"),
        "associateCommand": this.projectForm.value.associateCommand,
        "tasks": taskFinal,
        "progress": 0,
        "numberTasks": this.tasks.length
      }
      this.listProject?.push(info);
      await this.serviceBD.setData("projects", info);
      this.projectForm.reset();
      this.tasks = [""]
      await this.fetchData();
      this.closeModal();
      console.log(info);
    } else {
      this.openDialogDate();
    }
  }

  async openDialogDate() {
    const alert = await this.alertCtrl.create(
      {
        header: 'Erreur',
        message: "Veillez présiser toutes les dates s'il vous plaît",
        buttons: ['OK']
      });
    await alert.present();
  }

  async getHistory() {
    await this.serviceBD.getData("ListCart").then((data: any[]) => {
      this.tabHistory = data
      this.tabHistory ? this.lenghttabhistory = this.tabHistory?.length : this.lenghttabhistory = 0
    });
  }

  async fetchData() {
    await this.serviceBD.getData("projects").then((data: any[]) => {
      this.listProject = data
    })
  }

  async ngOnInit() {
    await this.fetchData()
    await this.getHistory();
  }

}
