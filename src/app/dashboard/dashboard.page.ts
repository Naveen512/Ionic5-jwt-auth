import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { TodoServie } from "../services/todos.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit {
  userName = "";
  todos:any;
  constructor(private authService: AuthService,
    private todoService:TodoServie) {}

  ngOnInit() {
    this.authService.userInfo.subscribe((user) => {
      alert(user);
      if (user) {
        this.userName = user.username;
      }
    });
    this.fetchTodos();
  }

  fetchTodos(){
    this.todoService.getTodos().subscribe(
      (data) => {
         this.todos = data;
      },
      (error) => {
        alert('failed fetch todos')
      }
    )
  }
}
