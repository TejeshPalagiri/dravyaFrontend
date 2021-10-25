import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup
  response = ""
  error = ""
  
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { 
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  fillDemoUserDetials(event) {
    let user = {
      email: "exampleuser@gmail.com",
      password: "359@Tejesh"
    }
    this.loginForm.setValue(user)
  }

  onSubmit() {
    const endPoint = environment.api + "user/login"
    if(this.loginForm.valid) {
      this.http.post(endPoint, this.loginForm.value).subscribe(response => {
        console.log(response)
        if(response['status'] == 200) {
          localStorage.setItem("access-token", response['result']['access-token'])
          this.router.navigate(['/list'])
        } else {
          this.error = response['msg']
        }
      }, error => {
        console.error(error)
        this.error = JSON.stringify(error)
      })
    }
  }

}
