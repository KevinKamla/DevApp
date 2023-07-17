import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DiagramPage } from '../diagram/diagram.page';

@Component({
  selector: 'app-taks',
  templateUrl: './taks.page.html',
  styleUrls: ['./taks.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule, DiagramPage]
})
export class TaksPage implements OnInit {

  modalIsOpen: boolean = false;
  modalIsOpener: boolean = false;
  listTasks: any[] = [];
  number = 90;
  tabHistory: any[] = [];
  lenghttabhistory: number = 0;
  idProject: string | null = "";
  tasks: string[] = [""]
  task: string = ""
  projectSelected: any;
  nbTask = 0;
  infoDelete: any;
  responsable: any
  priori: any
  currentTask: any;
  projectForm: any;
  segmentSelected: string = "tasks";
  openerSearch: boolean = false;
  priority = [
    "Difficile",
    "Normale",
    "Facile"
  ]

  constructor(
    private route: ActivatedRoute,
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

  }


  openModal() {
    this.modalIsOpen = true
  }

  openSearch() {
    if (this.openerSearch == false) {
      this.openerSearch = true;
    } else {
      this.openerSearch = false;
    }
  }

  openModalupdate(item: any) {
    this.modalIsOpener = true
    this.currentTask = item;
  }

  closeModal() {
    this.modalIsOpen = false
  }

  closeModalupdate() {
    this.modalIsOpener = false
    this.modal.dismiss()
  }

  onSearchChange(e:any){
    console.log(e.detail.value);
    
  }

  generateUniqueId(date: Date) {
    const randomId = Math.random().toString(20).substring(4, 7).toUpperCase();
    const formattedDate = date.getFullYear().toString()
    return formattedDate + randomId
  }


  async addTask() {
    this.tasks.push(this.task);
    this.removeTask("");
    let newTaskFinal: any[] = []
    this.tasks.forEach(item => {
      newTaskFinal.push(
        {
          autor: "",
          elt: item,
          priority: "",
          progress: 0
        }
      )
    })
    let newTask = this.projectSelected.tasks ? this.projectSelected.tasks.concat(newTaskFinal) : newTaskFinal

    this.projectSelected.tasks =
      console.log(newTask);

    const info = {
      "id": this.projectSelected.id,
      "intitule": this.projectSelected.intitule,
      "dateStart": this.projectSelected.dateDepart,
      "dateEnd": this.projectSelected.dateArrive,
      "associateCommand": this.projectSelected.associateCommand,
      "tasks": newTask,
      "progress": 0,
      "numberTasks": newTask?.length
    }
    await this.serviceBD.removeItem("projects", this.projectSelected);
    await this.serviceBD.setData("projects", info);
    this.tasks = [""]
    await this.fetchData();
    this.closeModal();
    this.projectSelected = info
    this.nbTask = this.projectSelected.tasks?.length
    console.log(info);

  }

  removeTask(item: string) {
    this.tasks = this.tasks?.filter((elt: string) => elt != item);
    console.log(this.tasks);
  }

  async getHistory() {
    await this.serviceBD.getData("ListCart").then((data: any[]) => {
      this.tabHistory = data
      this.tabHistory ? this.lenghttabhistory = this.tabHistory?.length : this.lenghttabhistory = 0
    });
  }

  async fetchData() {
    await this.serviceBD.getData("projects").then((data: any[]) => {
      this.listTasks = data
      this.projectSelected = this.listTasks?.filter((elt: any) => elt.id == this.idProject)[0];
    })
  }


  async handleDeleteTask(item: any) {
    const alert = await this.alertCtrl.create({
      subHeader: 'Confirmation',
      message: 'Confirmez la suppression de la tâche ' + item.intitule,
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
    await this.fetchData();
    let newTask = this.projectSelected.tasks.filter((elt: any) => elt.elt != item.elt)
    this.infoDelete = localStorage.setItem("infoDelete", "false")
    this.handleTask(newTask)
  }


  async handleTask(newTask: any[]) {
    const info = {
      "id": this.projectSelected.id,
      "intitule": this.projectSelected.intitule,
      "dateStart": this.projectSelected.dateDepart,
      "dateEnd": this.projectSelected.dateArrive,
      "associateCommand": this.projectSelected.associateCommand,
      "tasks": newTask,
      "progress": 0,
      "numberTasks": newTask?.length
    };
    await this.serviceBD.removeItem("projects", this.projectSelected);
    await this.serviceBD.setData("projects", info);
    await this.fetchData();
    await this.fetchData();
  }


  async update() {
    console.log(this.currentTask, ' \n ', this.responsable, ' \n ', this.priori);
    this.projectSelected.tasks.forEach((elt: any) => {
      if (elt.elt == this.currentTask.elt) {
        if (this.priori) {
          elt.priority = this.priori;
        }
        if (this.responsable) {
          elt.autor = this.responsable;
        }
      }
    })
    await this.handleTask(this.projectSelected.tasks)
    console.log(this.projectSelected.tasks);
    this.projectForm.reset()
    this.closeModalupdate();
  }


  segmentChanged(e: any) {
    this.segmentSelected = e.detail.value;
  }

  async ngOnInit() {
    await this.fetchData()
    await this.getHistory();
    this.idProject = this.route.snapshot.paramMap.get('id');
    this.projectSelected = this.listTasks?.filter((elt: any) => elt.id == this.idProject)[0];
    this.nbTask = this.projectSelected.tasks?.length || 0;
    if (this.idProject) {
      localStorage.setItem('idProjectSelected', this.idProject)
    }
    console.log(this.projectSelected);
    this.infoDelete = localStorage.getItem("infoDelete")
  }

}
