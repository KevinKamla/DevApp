import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ServicedbService } from 'src/app/services/database/servicedb.service';
import { GanttComponent,GanttModule, EditService , FilterService, SortService, SelectionService, 
          ToolbarService,DayMarkersService } from '@syncfusion/ej2-angular-gantt';
import { Gantt } from '@syncfusion/ej2-gantt';

// import { BryntumGanttComponent, BryntumProjectModelComponent } from '@bryntum/gantt-angular';
// import { ganttConfig, projectConfig } from './diagram.config';
// import 'dhtmlx-gantt';
// import { gantt } from 'dhtmlx-gantt';
// import { BryntumGanttModule } from '@bryntum/gantt-angular';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.page.html',
  styleUrls: ['./diagram.page.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [IonicModule, CommonModule, FormsModule, GanttModule],
  providers: [ EditService , FilterService, SortService, SelectionService,ToolbarService,DayMarkersService, ]
})
export class DiagramPage implements OnInit {
  // @ViewChild('gantt') ganttComponent!: BryntumGanttComponent;
  // @ViewChild('project') projectComponent!: BryntumProjectModelComponent;
  // ganttConfig :any = ganttConfig ;
  // projectConfig = projectConfig;

  idProjectSelected: any;
  listTasks: any[] = [];
  projectSelected: any;
  data: any[]= [];
  taskSettings: any;
  columnSettings: any;
  labelSettings: any;
  
  constructor(
    private serviceBD: ServicedbService,
  ) { }


  // startDate = new Date(2022, 0, 1);

  // tasks = [
  //   {
  //     id: 1,
  //     name: 'Write docs',
  //     expanded: true,
  //     children: [
  //       { id: 6, name: 'Proof-read docs', startDate: '2022-01-02', endDate: '2022-01-09' },
  //       { id: 3, name: 'Release docs', startDate: '2022-01-09', endDate: '2022-01-10' }
  //     ]
  //   }
  // ];

  // dependencies = [
  //   { fromTask: 6, toTask: 3 }
  // ];



  async fetchData() {
    await this.serviceBD.getData("projects").then((data: any[]) => {
      this.listTasks = data
      this.projectSelected = this.listTasks?.filter((elt: any) => elt.id == this.idProjectSelected)[0];
      console.log(this.projectSelected);

    })
  }

  getDiagramGantt(){
    this.data = [
      {
          TaskID: 1,
          TaskName: 'Project Initiation',
          StartDate: new Date('04/02/2021'),
          EndDate: new Date('04/21/2021')
      },
      {
          TaskID: 2,
          TaskName: 'Project Planning',
          StartDate: new Date('04/22/2021'),
          EndDate: new Date('05/21/2021')
      },
      {
          TaskID: 3,
          TaskName: 'Project Execution',
          StartDate: new Date('05/22/2021'),
          EndDate: new Date('06/21/2021')
      }
  ];
  
  this.taskSettings = {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      endDate: 'EndDate'
  };
  
  this.columnSettings = [
      { field: 'TaskID', headerText: 'Task ID' },
      { field: 'TaskName', headerText: 'Task Name' },
      { field: 'StartDate', headerText: 'Start Date' },
      { field: 'EndDate', headerText: 'End Date' }
  ];
  
  this.labelSettings = {
      leftLabel: 'TaskName'
  };
  
  }


  async ngOnInit(): Promise<void> {
    this.idProjectSelected = localStorage.getItem("idProjectSelected")
    await this.fetchData();

    // this.data = [
    //   {
    //     TaskID: 1,
    //     TaskName: 'Project Initiation',
    //     StartDate: new Date('04/02/2019'),
    //     EndDate: new Date('04/21/2019'),
    //     subtasks: [
    //       { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
    //       { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
    //       { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
    //     ]
    //   },
    //   {
    //     TaskID: 5,
    //     TaskName: 'Project Estimation',
    //     StartDate: new Date('04/02/2019'),
    //     EndDate: new Date('04/21/2019'),
    //     subtasks: [
    //       { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
    //       { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
    //       { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
    //     ]
    //   },
    // ];
  }



}
