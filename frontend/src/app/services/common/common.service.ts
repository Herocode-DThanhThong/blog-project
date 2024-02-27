import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserResponse } from '../../response/user';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _user$ = new BehaviorSubject<UserResponse>({});
  private _isLogged$ = new BehaviorSubject<boolean>(false);
  private _isAdmin$ = new BehaviorSubject<boolean>(false);
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  constructor() {}
  getUser() {
    return this._user$.asObservable();
  }
  setUser(data: UserResponse) {
    this._user$.next({ ...data });
  }
  getIsLogged() {
    return this._isLogged$.asObservable();
  }
  setIsLogged(data: boolean) {
    this._isLogged$.next(data);
  }
  getIsAdmin() {
    return this._isAdmin$.asObservable();
  }
  setIsAdmin(data: boolean) {
    this._isAdmin$.next(data);
  }
  getIsLoading() {
    return this._isLoading$.asObservable();
  }
  setIsLoading(data: boolean) {
    this._isLoading$.next(data);
  }
}
