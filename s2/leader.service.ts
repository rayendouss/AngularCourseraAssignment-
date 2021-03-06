import { Injectable } from '@angular/core';
import {Leader} from '../shared/leader';
import {Leaders} from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }
  getLeaders(): Leader[] {
    return Leaders;
  }
  getLeaderFeatured(): Leader {
    return Leaders.filter((leader) => leader.featured)[0];
  }
}
