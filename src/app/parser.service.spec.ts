import { TestBed } from '@angular/core/testing';
import { ParserService } from './parser.service';
import {
  CheckboxElement,
  SelectionElement,
  NumberInputElement,
  TextElement,
  TextInputElement,
  UIElement,
  IfThenElseBlock,
  RepeatBlock,
  UIBlock
} from './classes';
import { PropertyKey } from './classes';

describe('ParserService', () => {
  let parserService: ParserService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    parserService = TestBed.inject(ParserService);
  });

  it('should be created', () => {
    expect(parserService).toBeTruthy();
  });

  it('should check input script header for validity and accepted version', () => {
    let rootBlock: UIBlock = parserService.parseUnitDefinition(['iqb-scripted::1.0']);
    expect(rootBlock.elements.length).toEqual(0);

    let errorText: string;
    rootBlock = parserService.parseUnitDefinition(['']);
    errorText = (rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Kein Keyword gefunden!');

    rootBlock = parserService.parseUnitDefinition(['bla']);
    errorText = (rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Typ muss iqb-scripted sein!');

    rootBlock = parserService.parseUnitDefinition(['iqb-scripted']);
    errorText = (rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Kein Version-Parameter gefunden!');

    rootBlock = parserService.parseUnitDefinition(['iqb-scripted::aa']);
    errorText = (rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');
    rootBlock = parserService.parseUnitDefinition(['iqb-scripted::1.a']);
    errorText = (rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');
    rootBlock = parserService.parseUnitDefinition(['iqb-scripted::a.1']);
    errorText = (rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Version-Parameter Fehlerhaft!');

    rootBlock = parserService.parseUnitDefinition(['iqb-scripted::0.1']);
    errorText = (rootBlock.elements[0] as UIElement).properties.get(PropertyKey.TEXT);
    expect(errorText).toEqual('Scriptfehler: Scriptversion nicht unterstützt (erste Zeile)!' +
      'Unterstützte Versionen: 1');
  });

  it('should create text elements', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'title::Testscript Title??Hilfetext1\n' +
      'header::Abschnitt 1 Basic Elements??Hilfetext2\n' +
      'header\n' +
      'text::Standard Text Element??Hilfetext1\n' +
      '\n' +
      'text::Standard Text Element2\n' +
      'html::HTML Ele <strong>strong</strong> and hyperlink: ' +
      '<a href=”https://www.iqb.hu-berlin.de”>IQB website</a>';
    const rootBlock: UIBlock = parserService.parseUnitDefinition(testScript.split('\n'));

    expect(rootBlock.elements.length).toEqual(7);

    expect(rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        properties: new Map([
          [0, 'Testscript Title']
        ]),
        helpText: 'Hilfetext1',
        fieldType: 2,
        hidden: false
      } as unknown as TextElement
    ));
    expect(rootBlock.elements[1]).toEqual(jasmine.objectContaining(
      {
        properties: new Map([
          [0, 'Abschnitt 1 Basic Elements']
        ]),
        helpText: 'Hilfetext2',
        fieldType: 1,
        hidden: false
      } as unknown as TextElement
    ));
    expect(rootBlock.elements[2]).toEqual(jasmine.objectContaining(
      { fieldType: 0 } as TextElement
    ));
    expect(rootBlock.elements[3]).toEqual(jasmine.objectContaining(
      {
        properties: new Map([
          [0, 'Standard Text Element']
        ]),
        helpText: 'Hilfetext1',
        fieldType: 0,
        hidden: false
      } as unknown as TextElement
    ));
    expect(rootBlock.elements[4]).toEqual(jasmine.objectContaining(
      {
        fieldType: 0,
        hidden: false
      } as TextElement
    ));
    expect(rootBlock.elements[5]).toEqual(jasmine.objectContaining(
      {
        properties: new Map([
          [0, 'Standard Text Element2']
        ]),
        helpText: null,
        fieldType: 0,
        hidden: false
      } as unknown as TextElement
    ));
    expect(rootBlock.elements[6]).toEqual(jasmine.objectContaining(
      {
        properties: new Map([
          [
            0,
            'HTML Ele <strong>strong</strong> and hyperlink: ' +
            '<a href=”https://www.iqb.hu-berlin.de”>IQB website</a>'
          ]
        ]),
        helpText: null,
        fieldType: 5,
        hidden: false
      } as unknown as TextElement
    ));
  });

  it('should create input elements', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'input-text::text_var1::1::Text eingeben::Text nach Feld::0::10??Hilfetextxy\n' +
      'input-number::num_var1::0::Nummer eingeben::Text nach Feld::0::10??Hilfetext1\n' +
      'checkbox::check_var1::0::Bitte ankreuzen\n' +
      'multiple-choice::mc_var1::1::Multiple Choice Feld::postTTT::Choice1##Choice2##Choice3??Hilfetext1\n' +
      'drop-down::dd_var1::1::Dropdown Feld::::Choice1##Choice2##Choice3??Hilfetext1';
    const rootBlock: UIBlock = parserService.parseUnitDefinition(testScript.split('\n'));

    expect(rootBlock.elements.length).toEqual(5);
    expect(rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        id: 'text_var1',
        required: true,
        properties: new Map([
          [0, 'Text eingeben'],
          [1, 'Text nach Feld'],
          [5, '0'],
          [4, '10']
        ]),
        helpText: 'Hilfetextxy',
        fieldType: 3,
        hidden: false
      } as unknown as TextInputElement
    ));
    expect(rootBlock.elements[1]).toEqual(jasmine.objectContaining(
      {
        id: 'num_var1',
        required: false,
        properties: new Map([
          [0, 'Nummer eingeben'],
          [1, 'Text nach Feld'],
          [3, '0'],
          [2, '10']
        ]),
        helpText: 'Hilfetext1',
        fieldType: 4,
        hidden: false
      } as unknown as NumberInputElement
    ));
    expect(rootBlock.elements[2]).toEqual(jasmine.objectContaining(
      {
        id: 'check_var1',
        value: 'false',
        required: false,
        properties: new Map([
          [0, 'Bitte ankreuzen']
        ]),
        helpText: null,
        fieldType: 7,
        hidden: false
      } as unknown as CheckboxElement
    ));
    expect(rootBlock.elements[3]).toEqual(jasmine.objectContaining(
      {
        id: 'mc_var1',
        required: true,
        properties: new Map([
          [0, 'Multiple Choice Feld'],
          [1, 'postTTT']
        ]),
        helpText: 'Hilfetext1',
        fieldType: 8,
        hidden: false
      } as unknown as MultiChoiceElement
    ));
    expect(rootBlock.elements[4]).toEqual(jasmine.objectContaining(
      {
        id: 'dd_var1',
        required: true,
        properties: new Map([
          [0, 'Dropdown Feld']
        ]),
        helpText: 'Hilfetext1',
        fieldType: 9,
        hidden: false
      } as unknown as DropDownElement
    ));
  });

  it('should create basic if element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'if-start::check_var1::true\n' +
      'text::Checked\n' +
      'if-end';
    const rootBlock: UIBlock = parserService.parseUnitDefinition(testScript.split('\n'));

    expect(rootBlock.elements.length).toEqual(1);
    expect(rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        conditionVariableName: 'check_var1',
        conditionTrueValue: 'true',
        elements: [],
        falseElements: [],
        hidden: false
      } as IfThenElseBlock
    ));
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).toContain(
      jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'Checked']
          ]),
          helpText: null,
          hidden: false
        } as unknown as TextElement
      )
    );
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).not.toContain(
      jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'CheckedDummy']
          ]),
          helpText: null,
          hidden: false
        } as unknown as TextElement
      )
    );
  });

  it('should create basic if-else element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'if-start::check_var1::true\n' +
      'text::Checked\n' +
      'if-else\n' +
      'text::elseText\n' +
      'if-end';
    const rootBlock: UIBlock = parserService.parseUnitDefinition(testScript.split('\n'));

    expect(rootBlock.elements.length).toEqual(1);
    expect(rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        conditionVariableName: 'check_var1',
        conditionTrueValue: 'true',
        elements: [],
        hidden: false
      } as IfThenElseBlock
    ));
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).toContain(
      jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'Checked']
          ]),
          helpText: null,
          hidden: false
        } as unknown as TextElement
      )
    );
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).falseElements).toContain(
      jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'elseText']
          ]),
          helpText: null,
          hidden: false
        } as unknown as TextElement
      )
    );
  });

  it('should create nested if-else element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'if-start::check_var1::true\n' +
      'text::Checked\n' +
      'if-start::check_var2::true\n' +
      'text::Check var 2 true!\n' +
      'if-end\n' +
      'if-else\n' +
      'text::elseText\n' +
      'if-end';
    const rootBlock: UIBlock = parserService.parseUnitDefinition(testScript.split('\n'));

    expect(rootBlock.elements.length).toEqual(1);
    expect(rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        conditionVariableName: 'check_var1',
        conditionTrueValue: 'true',
        elements: [],
        hidden: false
      } as IfThenElseBlock
    ));
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements.length).toEqual(2);
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements)
      .toContain(jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'Checked']
          ]),
          helpText: null,
          hidden: false
        } as unknown as TextElement
      ));
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).trueElements).toContain(
      jasmine.objectContaining(
        {
          conditionVariableName: 'check_var2',
          conditionTrueValue: 'true',
          elements: [],
          falseElements: [],
          hidden: false
        } as IfThenElseBlock
      )
    );
    expect(((rootBlock.elements[0] as unknown as IfThenElseBlock)
      .trueElements[1] as unknown as IfThenElseBlock).trueElements)
      .toContain(jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'Check var 2 true!']
          ]),
          helpText: null,
          hidden: false
        } as TextElement
      ));
    expect((rootBlock.elements[0] as unknown as IfThenElseBlock).falseElements).toContain(
      jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'elseText']
          ]),
          helpText: null,
          hidden: false
        } as unknown as TextElement
      )
    );
  });

  it('should create basic repeat element', () => {
    const testScript = 'iqb-scripted::1.0\n' +
      'repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20??HEpText\n' +
      'text::Repeat Inhalt\n' +
      'repeat-end';
    const rootBlock: UIBlock = parserService.parseUnitDefinition(testScript.split('\n'));

    expect(rootBlock.elements.length).toEqual(1);
    expect(rootBlock.elements[0]).toEqual(jasmine.objectContaining(
      {
        id: 'examineecount',
        helpText: 'HEpText',
        elements: [],
        localIDs: [],
        properties: new Map([
          [0, 'Wie viele Prüflinge gibt es?'],
          [1, 'Angaben zu Prüfling'],
          [2, '20']
        ]),
        hidden: false
      } as RepeatBlock
    ));

    expect((rootBlock.elements[0] as RepeatBlock).templateElements.length).toEqual(1);
    expect((rootBlock.elements[0] as RepeatBlock).templateElements)
      .toContain(jasmine.objectContaining(
        {
          fieldType: 0,
          properties: new Map([
            [0, 'Repeat Inhalt']
          ]),
          helpText: null,
          hidden: false
        } as unknown as TextElement
      ));
  });
});
