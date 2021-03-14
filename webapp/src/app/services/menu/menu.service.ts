import { Injectable } from '@angular/core';
import { MenuItem } from '../../interfaces/menuItem'

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public items: Array<MenuItem> = [
    { name: 'Research', path: '/research' },
    { name: 'Documentation', path: '/documentation' },
    { name: 'Paper', path: '/paper' },
    { name: 'Take the test', path: '/take-the-test' }
  ]

  constructor() { }
}
