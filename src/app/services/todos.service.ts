import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable()
export class TodoServie {
    constructor(private http:HttpClient){

    }

    getTodos():Observable<any>{
        return this.http.get("http://localhost:3000/todos");
    }
}