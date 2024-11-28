import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  standalone: false,
  template: `
    <h1 mat-dialog-title>
      Eingabe Unit-Definition
    </h1>
    <mat-dialog-content>
      <mat-form-field [style.width]="'100%'">
        <textarea matInput [(ngModel)]="scriptText" rows="21"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-raised-button [mat-dialog-close]="true">Start</button>
      <button mat-button [mat-dialog-close]="false">Abbrechen</button>
    </mat-dialog-actions>
  `,
  styles: [
    `textarea {
      white-space: pre;
      overflow-wrap: normal;
      overflow-x: scroll;
      resize: none
    }`
  ]
})

export class InputScriptDialogComponent {
  scriptText = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: unknown) {
    this.scriptText = data as string;
  }
}
