import { Injectable } from '@angular/core';
import {
  SimpleBlock,
  ErrorElement,
  UIElement,
  TextElement,
  NumberInputElement,
  TextInputElement,
  CheckboxElement,
  SelectionElement,
  NavButtonGroupElement,
  HRElement,
  LikertBlock,
  LikertElement,
  RepeatBlock,
  IfThenElseBlock
} from './classes';
import { FieldType } from './classes/interfaces';
import { InputElement } from './classes/elements/input-element.class';

@Injectable({
  providedIn: 'root'
})

export class ParserService {
  static parseUnitDefinition(scriptLines: string[]): SimpleBlock {
    const returnBlock = new SimpleBlock('');
    let headerLine = '';
    while (!headerLine && scriptLines.length > 0) {
      headerLine = scriptLines.shift().trim();
    }
    if (scriptLines.length > 0) {
      if (ParserService.scriptHeaderOk(headerLine)) {
        returnBlock.elements = ParserService.parseScriptLineBlock('', 1, scriptLines);
      } else {
        returnBlock.elements.push(new ErrorElement('script-error.invalid-format'));
      }
    } else {
      returnBlock.elements.push(new ErrorElement('script-error.empty-definition'));
    }
    return returnBlock;
  }

  private static scriptHeaderOk(headerLine: string): boolean {
    const lineMatches = headerLine.trim().match(/^iqb-scripted::(\d+).(\d+)$/i);
    if (lineMatches && lineMatches.length > 2) {
      const majorVersion = parseInt(lineMatches[1], 10);
      const minorVersion = parseInt(lineMatches[2], 10);
      if (majorVersion === 1 && minorVersion === 0) return true;
    }
    return false;
  }

  private static parseScriptLineBlock(subform: string, lineOffset: number, blockLines: string[]): UIElement[] {
    const returnElements: UIElement[] = [];
    let lineNumber = lineOffset;
    let lineSplits: string[] = [];
    while (blockLines.length > 0) {
      lineSplits = blockLines.shift().split('::');
      lineNumber += 1;
      if (lineSplits) {
        const keyword = lineSplits.shift().trim().toLowerCase();
        const restOfLine = lineSplits.join('::');
        let keywordInBlock = '';
        let restOfLineInBlock = '';
        let endOfBlockMarkerFound = false;
        let lineBuffer: string[] = [];
        let newElement: UIElement;
        try {
          switch (keyword) {
            case 'hr':
              returnElements.push(new HRElement());
              break;
            case 'text':
              returnElements.push(new TextElement(restOfLine));
              break;
            case 'header':
              newElement = new TextElement(restOfLine);
              newElement.type = FieldType.HEADER;
              returnElements.push(newElement);
              break;
            case 'title':
              newElement = new TextElement(restOfLine);
              newElement.type = FieldType.TITLE;
              returnElements.push(newElement);
              break;
            case 'html':
              newElement = new TextElement(restOfLine);
              newElement.type = FieldType.HTML;
              returnElements.push(newElement);
              break;
            case 'input-text':
              returnElements.push(new TextInputElement(subform, restOfLine));
              break;
            case 'input-number':
              returnElements.push(new NumberInputElement(subform, restOfLine));
              break;
            case 'checkbox':
              returnElements.push(new CheckboxElement(subform, restOfLine));
              break;
            case 'multiple-choice':
              newElement = new SelectionElement(subform, restOfLine);
              newElement.type = FieldType.MULTIPLE_CHOICE;
              returnElements.push(newElement);
              break;
            case 'drop-down':
              newElement = new SelectionElement(subform, restOfLine);
              newElement.type = FieldType.DROP_DOWN;
              returnElements.push(newElement);
              break;
            case 'nav-button-group':
              returnElements.push(new NavButtonGroupElement(restOfLine));
              break;
            case 'likert-start':
              lineBuffer = [];
              endOfBlockMarkerFound = false;
              while (!endOfBlockMarkerFound && (blockLines.length > 0)) {
                lineSplits = blockLines.shift().split('::');
                lineNumber += 1;
                keywordInBlock = lineSplits.shift().trim().toLowerCase();
                restOfLineInBlock = lineSplits.join('::');
                if (keywordInBlock === 'likert-end') {
                  if (lineBuffer.length > 0) {
                    newElement = new LikertBlock(subform, restOfLine);
                    while (lineBuffer.length > 0) {
                      (newElement as LikertBlock).elements.push(new LikertElement(subform, lineBuffer.shift()));
                    }
                    returnElements.push(newElement);
                  } else {
                    returnElements.push(new ErrorElement('script-error.empty-likert-block'));
                  }
                  endOfBlockMarkerFound = true;
                } else if (keywordInBlock === 'likert') {
                  lineBuffer.push(restOfLineInBlock);
                } else if (keywordInBlock.length > 0) {
                  returnElements.push(new ErrorElement('script-error.unexpected-keyword-in-likert-block'));
                }
              }
              if (!endOfBlockMarkerFound) returnElements.push(new ErrorElement('script-error.unfinished-likert-block'));
              break;
            case 'repeat-start':
              lineBuffer = [];
              endOfBlockMarkerFound = false;
              while (!endOfBlockMarkerFound && (blockLines.length > 0)) {
                lineSplits = blockLines.shift().split('::');
                keywordInBlock = lineSplits.shift().trim().toLowerCase();
                restOfLineInBlock = lineSplits.join('::');
                if (keywordInBlock === 'repeat-end') {
                  if (lineBuffer.length > 0) {
                    newElement = new RepeatBlock(subform, restOfLine);
                    (newElement as RepeatBlock).elements = ParserService.parseScriptLineBlock(
                      `${subform ? `${subform}##` : ''}${(newElement as RepeatBlock).id}`, lineNumber, lineBuffer
                    );
                    lineNumber += lineBuffer.length;
                    returnElements.push(newElement);
                  } else {
                    returnElements.push(new ErrorElement('script-error.empty-repeat-block'));
                  }
                  endOfBlockMarkerFound = true;
                } else {
                  lineBuffer.push(`${keywordInBlock}::${restOfLineInBlock}`);
                }
              }
              if (!endOfBlockMarkerFound) returnElements.push(new ErrorElement('script-error.unfinished-repeat-block'));
              break;

            case 'if-start':
              lineBuffer = [];
              endOfBlockMarkerFound = false;
              newElement = null;
              while (!endOfBlockMarkerFound && (blockLines.length > 0)) {
                lineSplits = blockLines.shift().split('::');
                keywordInBlock = lineSplits.shift().trim().toLowerCase();
                restOfLineInBlock = lineSplits.join('::');
                if (keywordInBlock === 'if-else') {
                  newElement = new IfThenElseBlock(subform, restOfLine);
                  (newElement as IfThenElseBlock).trueElements =
                    ParserService.parseScriptLineBlock(subform, lineNumber, lineBuffer);
                  lineNumber += lineBuffer.length;
                  returnElements.push(newElement);
                  lineBuffer = [];
                } else if (keywordInBlock === 'if-end') {
                  if (newElement) {
                    (newElement as IfThenElseBlock).falseElements =
                      ParserService.parseScriptLineBlock(subform, lineNumber, lineBuffer);
                    lineNumber += lineBuffer.length;
                  } else {
                    newElement = new IfThenElseBlock(subform, restOfLine);
                    returnElements.push(newElement);
                    (newElement as IfThenElseBlock).trueElements =
                      ParserService.parseScriptLineBlock(subform, lineNumber, lineBuffer);
                    lineNumber += lineBuffer.length;
                  }
                  endOfBlockMarkerFound = true;
                } else {
                  lineBuffer.push(`${keywordInBlock}::${restOfLineInBlock}`);
                }
              }
              if (!endOfBlockMarkerFound) returnElements.push(new ErrorElement('script-error.unfinished-if-block'));
              break;
            default:
              if (keyword) {
                if (keyword !== 'rem') returnElements.push(new ErrorElement('script-error.invalid-keyword', keyword));
              } else {
                returnElements.push(new TextElement());
              }
          }
        } catch {
          returnElements.push(new ErrorElement('script-error.syntax', lineNumber.toString()));
        }
      } else {
        returnElements.push(new TextElement());
      }
    }
    returnElements.push(...ParserService.checkForMultipleIds(returnElements));
    return returnElements;
  }

  static checkForMultipleIds(elementsToCheck: UIElement[]): ErrorElement[] {
    const returnElements: ErrorElement[] = [];
    const doubleIds: string[] = [];
    const singleIds: string[] = [];
    ParserService.getAllIds(elementsToCheck).forEach(id => {
      if (singleIds.includes(id)) {
        if (!doubleIds.includes(id)) doubleIds.push(id);
      } else {
        singleIds.push(id);
      }
    });
    doubleIds.forEach(id => {
      returnElements.push(new ErrorElement('script-error.multiple-id', id));
    });
    return returnElements;
  }

  static getAllIds(elementsToCheck: UIElement[]): string[] {
    const allIds: string[] = [];
    elementsToCheck.forEach(e => {
      if (e instanceof InputElement) {
        allIds.push((e as InputElement).id);
      } else if (e instanceof RepeatBlock) {
        allIds.push((e as RepeatBlock).id);
        // ignore templateElements because these are of new scope/subform
      } else if (e instanceof LikertBlock) {
        (e as LikertBlock).elements.forEach(liE => {
          if (liE instanceof LikertElement) allIds.push((liE as LikertElement).id);
        });
      } else if (e instanceof IfThenElseBlock) {
        allIds.push(...ParserService.getAllIds((e as IfThenElseBlock).trueElements));
        allIds.push(...ParserService.getAllIds((e as IfThenElseBlock).falseElements));
      }
    });
    return allIds;
  }
}
