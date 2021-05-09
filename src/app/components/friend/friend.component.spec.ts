import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendComponent } from './friend.component';

describe('FriendComponentComponent', () => {
  let component: FriendComponent;
  let fixture: ComponentFixture<FriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
