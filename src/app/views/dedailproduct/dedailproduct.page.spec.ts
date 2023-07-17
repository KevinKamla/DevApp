import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DedailproductPage } from './dedailproduct.page';

describe('DedailproductPage', () => {
  let component: DedailproductPage;
  let fixture: ComponentFixture<DedailproductPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DedailproductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
