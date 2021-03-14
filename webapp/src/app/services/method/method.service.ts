import { Injectable } from '@angular/core';
import { Method } from '../../interfaces/method'

@Injectable({
  providedIn: 'root'
})
export class MethodService {
  public methods: Array<Method> = [
    { id: '1', name: 'Bpm mapping', desc: 'Beats per minutes changes as color changes' },
    { id: '2', name: 'Track mapping', desc: 'Melody completely changes as color changes' },
    { id: '3', name: 'Key mapping', desc: 'Note key changes as color changes' }
  ]

  constructor() { }
}
