import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userName = ''
  constructor(private authService:AuthService) { }

  ngOnInit() {
    this.authService.userInfo.subscribe(user => {
      alert(user)
      if(user){
        this.userName = user.username;
      }
    })
  }

}
