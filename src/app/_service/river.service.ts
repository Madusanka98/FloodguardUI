import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { river } from '../_model/river.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RiverService {
  constructor(private http: HttpClient) { }

  baseUrl = environment.apiUrl;

  Getall() {
    return this.http.get<river[]>(this.baseUrl + 'river/GetAll');
  }

  Getbycode(id:number) {
    return this.http.get<river>(this.baseUrl + 'river/Getbycode?id='+id);
  }

  Createriver(_data: river) {
    return this.http.post(this.baseUrl + 'river/create', _data);
  }

  Updateriver(_data: river) {
    return this.http.put(this.baseUrl + 'river/Update?id=' + _data.id, _data);
  }

  Deleteriver(id: number) {
    return this.http.delete(this.baseUrl + 'river/Remove?id=' + id);
  }
}
