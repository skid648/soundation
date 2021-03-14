import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public currentYear: number

  constructor(public menuService: MenuService) {
    this.currentYear = new Date().getFullYear()
  }

  ngOnInit(): void {
  }

}
