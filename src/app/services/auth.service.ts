import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of, throwError } from "rxjs";
import { map, switchMap, flatMap } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import {Storage} from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userInfo = new BehaviorSubject(null);
  jwtHelper = new JwtHelperService();
  checkUserObs:Observable<any>;
  constructor(
    private readonly storage:Storage,
    private readonly platform:Platform,
    private readonly http:HttpClient
  ) {
    this.loadUserInfo();
  }

  loadUserInfo() {
    let readyPlatformObs = from(this.platform.ready());

    this.checkUserObs = readyPlatformObs.pipe(
      switchMap(() => {
          return from(this.getAccessToken());
      }),
      map((token) => {
        if(!token){
          return null;
        }
          var decodedUser = this.jwtHelper.decodeToken(token);
          this.userInfo.next(decodedUser);
          return true;
      }));
    
  }

  getAccessToken(){
    return this.storage.get("access_token");
  }

  getRefreshToke(){
    return this.storage.get("refresh_token");
  }

  callRefreshToken(payload){
    return this.http.post("http://localhost:3000/auth/refreshtoken", payload);
  }

  useLogin(login: any): Observable<boolean> {
    if(login && login.email && login.password){
      var payload={
        username:login.email,
        password:login.password
      };
      return this.http.post("http://localhost:3000/auth/login",payload).pipe(
        map((response:any)=>{
          console.log(response);
          this.storage.set('access_token',response.access_token);
          this.storage.set('refresh_token', response.refresh_token);
          var decodedUser = this.jwtHelper.decodeToken(response.access_token);
          this.userInfo.next(decodedUser);
          console.log(decodedUser);
          return true;
        })
      )
    }
    
    return of(false);
  }
}
