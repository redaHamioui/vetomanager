import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetformComponent } from './sheetform.component';

describe('SheetformComponent', () => {
  let component: SheetformComponent;
  let fixture: ComponentFixture<SheetformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetformComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
