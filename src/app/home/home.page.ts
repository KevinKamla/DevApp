import { Component, OnInit, ElementRef, ViewChild, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimationController, IonicModule, ModalController } from '@ionic/angular';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Chart } from 'chart.js/auto';
import * as moment from 'moment';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServicedbService } from '../services/database/servicedb.service';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, HttpClientModule, ReactiveFormsModule],
  providers: [HttpClient, HttpClientModule, ServicedbService]
})

export class HomePage implements OnInit {

  @ViewChild('lineCanvas') private lineCanvas: any;

  lengthCart: number = 0;
  lineChart: any;
  myChart: any;
  date: any;
  modalIsOpen: boolean = false;

  constructor(
    private animationCtrl: AnimationController,
    private modal: ModalController,
    private serviceBD: ServicedbService,
  ) {
    this.date = moment().format('MMMM Do YYYY');
    // this.date = moment().format('MMMM Do YYYY, h:mm:ss a');

  }

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

  CommandeForm() {
    const info = {
      "intitule": this.titleForm.value.intitule,
      "client": this.titleForm.value.client,
      "adresse": this.titleForm.value.adresse,
      "ville": this.titleForm.value.ville
    }

    this.serviceBD.setData("infoCommand", info)
    this.modal.dismiss();
  }


  // ====================== Chart ===============================

  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'],
        datasets: [
          {
            label: 'Moyenne de revenus par semaine',
            fill: false,
            backgroundColor: '#3880ff',
            borderColor: '#3880ff',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.5,
            borderJoinStyle: 'miter',
            pointBorderColor: '#3880ff',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#3880ff',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [59, 81, 40, 10, 5, 50, 10],
            spanGaps: true,
            tension: 0.3,
            animation: {
              loop: false,
              delay: 500,
              easing: 'easeInQuad',
              duration: 5000
            }
          }
        ]
      }
    });
  }

  // =================== Annimation des modals ============================

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root?.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  ionViewWillEnter() {
    const value = localStorage.getItem("nbItem")
    value == undefined || null ? this.lengthCart = 0 : this.lengthCart = parseInt(value)

    console.log("this.lengthCart : ", this.lengthCart);
  }

  ngAfterViewInit() {
    this.lineChartMethod();
  }

  ngOnInit() {
  }


}
