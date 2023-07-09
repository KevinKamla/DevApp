import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaksPage } from './taks.page';

describe('TaksPage', () => {
  let component: TaksPage;
  let fixture: ComponentFixture<TaksPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TaksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
