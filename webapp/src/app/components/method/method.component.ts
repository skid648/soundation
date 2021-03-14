import { Component, Input, OnInit } from '@angular/core';
import { Method } from '../../interfaces/method'

@Component({
  selector: 'app-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.scss']
})
export class MethodComponent implements OnInit {
  @Input() method?: Method

  constructor() { }

  ngOnInit(): void {}
}
