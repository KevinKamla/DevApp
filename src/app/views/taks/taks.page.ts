import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';;

@Component({
  selector: 'app-taks',
  templateUrl: './taks.page.html',
  styleUrls: ['./taks.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule]
})
export class TaksPage implements OnInit {

  modalIsOpen: boolean = false;
  listTasks: any[] = [];
  number = 20;
  priority = [
    "Difficile",
    "Normale",
    "Facile"
  ]
  tabHistory: any[] = [];
  lenghttabhistory: number = 0;
  idProject: string | null = "";
  projectForm: any;
  tasks: string[] = [""]
  task: string = ""
  projectSelected:any;

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

  closeModal() {
    this.projectForm.reset();
    this.modalIsOpen = false
  }

  generateUniqueId(date: Date) {
    const randomId = Math.random().toString(20).substring(4, 7).toUpperCase();
    const formattedDate = date.getFullYear().toString()
    return formattedDate + randomId
  }


  async ProjectFormulaire() {
    this.tasks.push(this.task);
    this.removeTask("");
    console.log(this.tasks);
    
    const info = {
      "id": this.generateUniqueId(new Date()),
      "intitule": this.projectSelected.intitule,
      "dateStart": this.projectSelected.dateDepart,
      "dateEnd": this.projectSelected.dateArrive,
      "associateCommand": this.projectSelected.associateCommand,
      "tasks": this.tasks,
      "progress": 0,
      "numberTasks": this.tasks.length
    }
    await this.serviceBD.setData("projects", info);
    this.projectForm.reset();
    this.tasks = [""]
    await this.fetchData();
    this.closeModal();
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
    })
  }

  async ngOnInit() {
    await this.fetchData()
    await this.getHistory();
    this.idProject = this.route.snapshot.paramMap.get('id');
    this.projectSelected = this.listTasks?.filter((elt: any) => elt.id == this.idProject)[0];
    console.log(this.projectSelected);

  }

}
