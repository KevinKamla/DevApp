import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrintcommandePage } from './printcommande.page';

describe('PrintcommandePage', () => {
  let component: PrintcommandePage;
  let fixture: ComponentFixture<PrintcommandePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrintcommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
