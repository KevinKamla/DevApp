import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListproductPage } from './listproduct.page';

describe('ListproductPage', () => {
  let component: ListproductPage;
  let fixture: ComponentFixture<ListproductPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
