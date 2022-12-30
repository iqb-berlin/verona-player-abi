import {
  Directive, Input, EventEmitter, Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldType } from '../classes/interfaces';

@Directive()
export abstract class ElementComponent {
  @Input() parentForm: FormGroup;
  @Output() valueChange = new EventEmitter();
  fieldType = FieldType; // to enable direct access to enum
}
