import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandePage } from './commande.page';

describe('CommandePage', () => {
  let component: CommandePage;
  let fixture: ComponentFixture<CommandePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
