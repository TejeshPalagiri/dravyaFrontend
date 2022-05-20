import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  response = "";
  error = "";

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { 
    this.registerForm = formBuilder.group ({
      email: ['', [Validators.required, ]],
      password: ['', [Validators.required, ]],
      gender: ['', Validators.required],
      // hobbies: [''],
      age: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    let endpoint = environment.api + "user/register";
    console.log("val", this.registerForm.value, this.registerForm.valid)
    if(this.registerForm.invalid) {
      this.error = "Please enter all fields correctly";
      return;
    }

    this.http.post(endpoint, this.registerForm.value).subscribe((response) => {
      if(response['status'] == 200) {
        this.router.navigate(['/login']);
      } else {
        this.error = response['msg']
      }
    }, (error) => {
      this.error = JSON.stringify(error)
    })

  }

}
