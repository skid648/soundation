import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero'
import { HeroService } from '../../services/hero/hero.service'
import {MessageService} from '../../services/message/message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  selectedHero?: Hero
  onSelect(hero: Hero): void {
    this.selectedHero = hero
    this.messageService.add('Hello')
  }

  constructor(private heroService: HeroService, private messageService: MessageService) {}

  getHeroes(): void {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  ngOnInit(): void {
    this.getHeroes()
  }

}
