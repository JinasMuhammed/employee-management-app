import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmployeesDeleteComponent } from './delete.component';

describe('EmployeesDeleteComponent', () => {
  let component: EmployeesDeleteComponent;
  let fixture: ComponentFixture<EmployeesDeleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [EmployeesDeleteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
