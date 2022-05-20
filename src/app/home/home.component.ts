import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  teamForm: FormGroup;
  error = "";
  playerForm: FormGroup;
  headers;
  allTeams = [];
  allPlayers = [];
  teamDisplayedColumns: string[] = ['name', 'maxBudget', 'actions'];
  playersDisplayedColoumns: string[] = ['name', 'team', 'biddingBudget', 'actions']

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.teamForm = formBuilder.group({
      name: ['', Validators.required],
      maxBudget: ['', Validators.required]
    })
    this.playerForm = formBuilder.group({
      name: ['', Validators.required],
      team: ['', Validators.required],
      biddingBudget: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.headers = new HttpHeaders().set(
      'authorization',
      localStorage.getItem('access-token')
    );
    this.getAllPlayers();
    this.getAllTeams();
  }

  createTeam() {
    if(this.teamForm.invalid) {
      this.error = "Please fill all the required field and create team";
      return;
    }

    let endPoint = environment.api + 'team';
    this.http.post(endPoint, this.teamForm.value, { headers: this.headers }).subscribe((result) => {
      if(result['status'] == 200) {
        this.error = "Created Team successfully !!!"
        this.teamForm.reset();
      } else {
        this.error = result['msg']
      }
    }, (error) => {
        console.error(error)
        this.error = JSON.stringify(error)
    })
  }

  createPlayer() {
    console.log("Hellooo i create team");
    if(this.playerForm.invalid) {
      this.error = "Please fill all the required field and create player";
      return;
    }

    let endPoint = environment.api + 'player';
    this.http.post(endPoint, this.playerForm.value, { headers: this.headers }).subscribe((result) => {
      if(result['status'] == 200) {
        this.error = "Created Player successfully !!!"
        this.playerForm.reset();
      } else {
        this.error = result['msg']
      }
    }, (error) => {
        console.error(error)
        this.error = JSON.stringify(error)
    })
    
  }

  getAllTeams() {
    let endpoint = environment.api + "team";
    this.http.get(endpoint, {headers: this.headers}).subscribe((response) => {
      if(response['status'] == 200) {
        this.allTeams = response['result'];

      }
    }, (error) => {
      this.error = "Failed to fetch all team details"
    })
  }

  getAllPlayers() {
    let endpoint = environment.api + "player";
    this.http.get(endpoint, {headers: this.headers}).subscribe((response) => {
      if(response['status'] == 200) {
        this.allPlayers = response['result'];
      }
    }, (error) => {
      this.error = "Failed to fetch all players details"
    })
  }

  openTeamDetails(teamName) {
    let teamPlayers = this.allPlayers.filter((player) => {
      return player.team == teamName
    })

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {players: teamPlayers, type:"team", teamName: teamName},
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log(("Closed dialog"));
    })
   
  }

}
