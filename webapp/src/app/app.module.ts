import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeroesComponent } from './components/heroes/heroes.component'
import { FormsModule } from '@angular/forms'
import { HeroDetailComponent } from './components/hero-detail/hero-detail.component'
import { MessagesComponent } from './components/messages/messages.component'
import { MainMenuComponent } from './components/main-menu/main-menu.component'
import { HomeComponent } from './components/home/home.component';
import { MethodComponent } from './components/method/method.component';
import { FooterComponent } from './components/footer/footer.component'

@NgModule({
  declarations: [
    AppComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    MainMenuComponent,
    HomeComponent,
    MethodComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
