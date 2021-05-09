import { TestBed } from '@angular/core/testing';

import { UserBasicAuthService } from './user-basic-auth.service';

describe('UserBasicAuthService', () => {
  let service: UserBasicAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserBasicAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
