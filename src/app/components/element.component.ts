import {
  Directive, EventEmitter, Output, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../classes/interfaces';

@Directive()
export abstract class ElementComponent {
  parentForm = input<FormGroup>();
  @Output() valueChange = new EventEmitter();
  fieldType = FieldType;
}
