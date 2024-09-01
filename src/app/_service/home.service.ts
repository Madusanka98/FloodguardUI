import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { currentPredict } from '../_model/CurrentPredict.model'; 
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  /*GetallCurrentPredict(configHours:string) :Observable<currentPredict[]>{
    debugger
    let myparams = new HttpParams()
        .set('configHours', configHours);
    //return this.http.get<currentPredict[]>(this.baseUrl + 'HistoryData/currentPredict');
    return this.http.get<any>(this.baseUrl + 'HistoryData/currentPredict', { params: myparams }).pipe(
      map(response => response as currentPredict[]) // Adjust the path based on your response structure
    );
  }*/
    GetallCurrentPredict(configHours:string){
      return this.http.get<currentPredict[]>(this.baseUrl + 'HistoryData/currentPredict?configHours='+configHours);
    }
}
