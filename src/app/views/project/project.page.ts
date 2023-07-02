import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ServicedbService } from 'src/app/services/database/servicedb.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProjectPage implements OnInit {

  @ViewChild('dateDepart') dateDepart: Date = new Date();
  @ViewChild('dateArrive') dateArrive: Date = new Date();

  modalIsOpen: boolean = false;
  listProject:any[] = [];

  constructor(
    private modal: ModalController,
    private serviceBD: ServicedbService,
  ) { }




  projectForm = new FormGroup({
    intitule: new FormControl(),
    priority: new FormControl(),
    associateCommand: new FormControl(),
  });

  openModal() {
    this.modalIsOpen = true
  }

  closeModal() {
    this.modalIsOpen = false
  }

  ProjectFormulaire() {
    const info = {
      "intitule": this.projectForm.value.intitule,
      "priority": this.projectForm.value.priority,
      "dateStart": this.dateDepart,
      "dateEnd": this.dateArrive,
      "associateCommand": this.projectForm.value.associateCommand,
    }
    console.log(info);
    this.listProject.push(info)
    // this.serviceBD.setData("project", info)
    this.closeModal()
  }


  ngOnInit() {
  }

}
