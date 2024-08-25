import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { riverStation } from '../_model/riverstation.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RiverstationService {
  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  Getall() {
    return this.http.get<riverStation[]>(this.baseUrl + 'riverStation/GetAll');
  }

  Getbycode(id:number) {
    return this.http.get<riverStation>(this.baseUrl + 'riverStation/Getbycode?id='+id);
  }

  CreateriverStation(_data: riverStation) {
    return this.http.post(this.baseUrl + 'riverStation/create', _data);
  }

  UpdateriverStation(_data: riverStation) {
    return this.http.put(this.baseUrl + 'riverStation/Update?id=' + _data.id, _data);
  }

  DeleteriverStation(id: number) {
    return this.http.delete(this.baseUrl + 'riverStation/Remove?id=' + id);
  }
}
