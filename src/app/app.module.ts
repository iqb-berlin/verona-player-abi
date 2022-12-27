import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// TODO move components into component dir. no reason to have sub dirs with one file
import {
  SubFormComponent,
  RepeatComponent,
  SelectComponent,
  CheckboxComponent,
  InputComponent,
  TextComponent,
  NavButtonsComponent,
  LikertComponent
} from './components';
import { AppComponent } from './app.component';
import { InputErrorPipe } from './components/input-error.pipe';
import { PlayerToolbarComponent } from './player-toolbar.component';
import {MatMenuModule} from "@angular/material/menu";

@NgModule({
  declarations: [
    TextComponent,
    InputComponent,
    CheckboxComponent,
    SelectComponent,
    InputErrorPipe,
    RepeatComponent,
    SubFormComponent,
    NavButtonsComponent,
    LikertComponent,
    AppComponent,
    PlayerToolbarComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    FormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
