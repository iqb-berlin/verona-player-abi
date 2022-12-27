import {
  Directive, Input, EventEmitter, Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UIElement } from '../classes';
import { FieldType } from '../classes/interfaces';

@Directive()
export abstract class ElementComponent {
  @Input() parentForm: FormGroup;
  @Output() elementDataChange = new EventEmitter<UIElement>();
  @Output() valueChange = new EventEmitter<string>();
  fieldType = FieldType;
}
