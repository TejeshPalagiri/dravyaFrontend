import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit {
  recipeForm: FormGroup;
  loading = false;
  addLoading = false;
  addError = '';
  addResponse = '';
  headers: any;
  error = '';
  recipeList: any = [];
  showAddPopup = false;
  deleteError = '';
  imagePattern = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/;
  filters = {
    sortOrder: 0,
    category: '',
    search: '',
  };
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.recipeForm = formBuilder.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if(!this.isLoggedIn()) {
      localStorage.clear()
      this.router.navigate(['/login'])
    }
    this.headers = new HttpHeaders().set(
      'authorization',
      localStorage.getItem('access-token')
    );
    this.getRecipeList();
  }

  isLoggedIn() {
    if(localStorage.getItem('access-token') && localStorage.getItem('access-token') != undefined) {
      return true
    } else {
      return false
    }
  }

  getRecipeList() {
    let endPoint = environment.api + 'app/getRecipies';
    this.loading = true;
    this.http.get(endPoint, { headers: this.headers }).subscribe(
      (response) => {
        this.loading = false;
        if (response['status'] == 200) {
          this.recipeList = response['result'];
          console.log('recipe', this.recipeList);
        } else {
          this.error = response['msg'];
        }
      },
      (error) => {
        console.error('Error', error);
        this.error = JSON.stringify(error);
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      let endpoint = environment.api + 'app/addRecipe';
      this.addLoading = true;
      this.http
        .post(endpoint, this.recipeForm.value, { headers: this.headers })
        .subscribe(
          (response) => {
            this.addLoading = false;

            if (response['status'] == 200) {
              this.addResponse = response['msg'];
              setTimeout(() => {
                this.showAddPopup = false;
                this.addError = '';
                this.addResponse = '';
                this.ngOnInit();
                this.recipeForm.reset()
              }, 1000);
            } else {
              this.addError = response['msg'];
              this.addResponse = '';
            }
          },
          (error) => {
            this.addError = JSON.stringify(error);
            this.addResponse = '';
            this.addLoading = false;
          }
        );
    } else {
      this.addLoading = false;
      this.addError = 'Please fill all the fields correctly';
    }
  }

  deleteRecipe(id, event) {
    event.preventDefault();
    let endPoint = `${environment.api}app/deleteRecipe/${id}`;
    this.http.delete(endPoint, { headers: this.headers }).subscribe(
      (response) => {
        if (response['status'] == 200) {
          this.ngOnInit();
        } else {
          this.deleteError = response['msg'];
        }
      },
      (error) => {
        console.error(error);
        this.deleteError = JSON.stringify(error);
      }
    );
  }

  filterDetails() {
    let params = new HttpParams();
    Object.keys(this.filters).forEach(
      (key) => (params = params.append(key, this.filters[key]))
    );
    console.log('Filtes', this.filters, params);
    let endPoint = environment.api + 'app/getRecipies';
    this.loading = true;
    this.http
      .get(endPoint, { headers: this.headers, params: params })
      .subscribe(
        (response) => {
          this.loading = false;
          if (response['status'] == 200) {
            this.recipeList = response['result'];
            console.log('recipe', this.recipeList);
          } else {
            this.recipeList = [];
            this.error = response['msg'];
          }
        },
        (error) => {
          console.error('Error', error);
          this.error = JSON.stringify(error);
          this.loading = false;
        }
      );
  }

  clearFilters() {
    this.filters.category = '';
    this.filters.search = '';
    this.filters.sortOrder = 0;
    this.ngOnInit();
  }
}
