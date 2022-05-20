import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  headers: any;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.headers = new HttpHeaders().set(
      'authorization',
      localStorage.getItem('access-token')
    );
  }

  isLoggedIn() {
    if(localStorage.getItem('access-token') && localStorage.getItem('access-token') != undefined) {
      return true
    } else {
      return false
    }
  }

  logout() {
    let endPoint = environment.api + "user/logout"
    this.http.delete(endPoint, {headers: this.headers}).subscribe(response => {
      if(response['status'] == 200) {
        this.router.navigate(['/login'])
        localStorage.clear()
      } else {
        console.log("Cant logout", response['msg'])
        this.router.navigate(['/login'])
      }
    }, error => {
      console.error(error)
    })
  }
}
