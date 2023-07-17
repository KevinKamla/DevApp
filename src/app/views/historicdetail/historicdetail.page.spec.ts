import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoricdetailPage } from './historicdetail.page';

describe('HistoricdetailPage', () => {
  let component: HistoricdetailPage;
  let fixture: ComponentFixture<HistoricdetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HistoricdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
