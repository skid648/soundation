import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {Hero} from "../../interfaces/hero";
import {HEROES} from "../../mocks/mock-heroes";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public items: Array<{ name: string, path:string }> = [
    { name: 'Research', path: '/research' },
    { name: 'Documentation', path: '/documentation' },
    { name: 'Paper', path: '/paper' },
    { name: 'Take the test', path: '/take-the-test' }
  ]

  constructor() { }
}
