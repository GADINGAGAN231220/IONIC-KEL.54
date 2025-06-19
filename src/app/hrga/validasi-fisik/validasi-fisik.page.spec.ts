import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidasiFisikPage } from './validasi-fisik.page';

describe('ValidasiFisikPage', () => {
  let component: ValidasiFisikPage;
  let fixture: ComponentFixture<ValidasiFisikPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidasiFisikPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
