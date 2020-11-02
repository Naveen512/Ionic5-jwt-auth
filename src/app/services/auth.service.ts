import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, of, throwError } from "rxjs";
import { map, switchMap } from "rxjs/operators";
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
          return from(this.getAccessToke());
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

  getAccessToke(){
    return this.storage.get("access_token");
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
          var decodedUser = this.jwtHelper.decodeToken(response.access_token);
          this.userInfo.next(decodedUser);
          console.log(decodedUser);
          return true;
        })
      )
    }
    // if (login && login.email && login.password) {
    //   var sampleJwt =
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3QiLCJzdWIiOjIsImlhdCI6MTYwNDMwOTc0OSwiZXhwIjoxNjA0MzA5ODA5fQ.jHez9kegJ7GT1AO5A2fQp6Dg9A6PBmeiDW1YPaCQoYs";

    //   return of(sampleJwt).pipe(
    //     map((token) => {
    //       if (!token) {
    //         return false;
    //       }
    //       this.storage.set('access_token',token);
    //       var decodedUser = this.jwtHelper.decodeToken(token);
    //       this.userInfo.next(decodedUser);
    //       console.log(decodedUser);
    //       return true;
    //     })
    //   );
    // }
    return of(false);
  }
}
