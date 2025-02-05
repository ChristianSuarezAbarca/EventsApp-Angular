import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginActivateGuardGuard } from './login-activate-guard.guard';

describe('loginActivateGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginActivateGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
