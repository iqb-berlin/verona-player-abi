import {
  Directive, input, output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../classes/interfaces';

@Directive()
export abstract class ElementComponent {
  parentForm = input<FormGroup>();
  valueChange = output();
  fieldType = FieldType;
}
