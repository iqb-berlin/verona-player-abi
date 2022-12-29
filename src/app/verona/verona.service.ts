import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import {
  ChunkData,
  ProgressValue,
  StartCommandData,
  UnitNavigationTarget,
  VeronaResponse
} from './verona.interfaces';

interface LocalUnitState {
  responseProgress?: ProgressValue,
  presentationProgress?: ProgressValue,
  dataParts?: { [k: string]: string },
  unitStateDataType?: string
}

const UnitStateDataType = 'iqb-standard@1.1';

@Injectable({
  providedIn: 'root'
})

export class VeronaService {
  private _navigationDenied = new Subject<string[]>();
  private _startCommand = new Subject<StartCommandData>();
  private _scrollY = new Subject<number>();
  private sessionId = '';

  constructor() {
    fromEvent(window, 'message')
      .subscribe((event: Event): void => {
        const messageData = (event as MessageEvent).data;
        switch (messageData.type) {
          case 'vopNavigationDeniedNotification':
            if (messageData.sessionId === this.sessionId) {
              this._navigationDenied.next(messageData.reasons || []);
            } else {
              VeronaService.sendConsoleMessage_Error('got invalid vopNavigationDeniedNotification (sessionId?)');
            }
            break;
          case 'vopStartCommand':
            if (messageData.sessionId) {
              if (messageData.unitDefinition) {
                this.sessionId = messageData.sessionId;
                const returnStartCommandData: StartCommandData = {
                  unitDefinition: messageData.unitDefinition,
                  unitState: [],
                  playerConfig: messageData.playerConfig
                };
                if (messageData.unitState && messageData.unitState.dataParts) {
                  returnStartCommandData.unitState = Object.keys(messageData.unitState.dataParts)
                    .map(k => {
                      let responses: VeronaResponse[];
                      try {
                        responses = JSON.parse(messageData.unitState.dataParts[k]);
                      } catch {
                        VeronaService.sendConsoleMessage_Warn(
                          `got invalid unitState in vopStartCommand (chunk id "${k}")`
                        );
                        responses = [];
                      }
                      return <ChunkData>{
                        id: k,
                        variables: responses
                      };
                    })
                    .filter(c => c.variables.length > 0);
                }
                this._startCommand.next(returnStartCommandData);
              } else {
                VeronaService.sendConsoleMessage_Error('got invalid vopStartCommand (missing unitDefinition)');
              }
            } else {
              VeronaService.sendConsoleMessage_Error('got invalid vopStartCommand (missing sessionId)');
            }
            break;

          case 'vopPageNavigationCommand':
            VeronaService.sendConsoleMessage_Warn('vopPageNavigationCommand not supported by this player');
            break;

          default:
            VeronaService.sendConsoleMessage_Warn(`unknown message type '${messageData.type}'`);
        }
      });

    window.addEventListener('blur', () => {
      window.parent.postMessage({
        type: 'vopWindowFocusChangedNotification',
        sessionId: this.sessionId,
        hasFocus: document.hasFocus()
      }, '*');
    });
    window.addEventListener('focus', () => {
      window.parent.postMessage({
        type: 'vopWindowFocusChangedNotification',
        sessionId: this.sessionId,
        hasFocus: document.hasFocus()
      }, '*');
    });
  }

  get navigationDenied(): Observable<string[]> {
    return this._navigationDenied.asObservable();
  }

  get startCommand(): Observable<StartCommandData> {
    return this._startCommand.asObservable();
  }

  get scrollY(): Observable<number> {
    return this._scrollY.asObservable();
  }

  requestUnitNavigation(target: UnitNavigationTarget) {
    if (window.parent) {
      window.parent.postMessage({
        type: 'vopUnitNavigationRequestedNotification',
        sessionId: this.sessionId,
        target: target
      }, '*');
    } else {
      VeronaService.sendConsoleMessage_Info(`vopUnitNavigationRequestedNotification "${target}" sent`);
    }
  }

  sendNewUnitState(dataChunks: ChunkData[], responseProgress: ProgressValue, presentationProgress: ProgressValue) {
    if (window === window.parent) {
      VeronaService.sendConsoleMessage_Info('vopStateChangedNotification sent');
    } else {
      const stateData: LocalUnitState = {};
      if (responseProgress) stateData.responseProgress = responseProgress;
      if (presentationProgress) stateData.presentationProgress = presentationProgress;
      if (dataChunks.length > 0) {
        stateData.unitStateDataType = UnitStateDataType;
        stateData.dataParts = {};
        dataChunks.forEach(ch => {
          stateData.dataParts[ch.id] = JSON.stringify(ch.variables);
        });
      }

      window.parent.postMessage({
        type: 'vopStateChangedNotification',
        sessionId: this.sessionId,
        timeStamp: Date.now(),
        unitState: stateData
      }, '*');
    }
  }

  static sendReadyNotification() {
    const playerMetadataElement = document.querySelector('#verona-metadata');
    if (window.parent) {
      window.parent.postMessage({
        type: 'vopReadyNotification',
        metadata: JSON.parse(playerMetadataElement ? playerMetadataElement.innerHTML : '{}'),
        apiVersion: '4' // to be backwards-compatible with the Teststudio-lite as of January 22
      }, '*');
    } else if (playerMetadataElement) {
      VeronaService.sendConsoleMessage_Info('ReadyNotification with metadata');
    } else {
      VeronaService.sendConsoleMessage_Warn('ReadyNotification (no metadata found)');
    }
  }

  private static sendConsoleMessage_Info(messageText: string): void {
    // eslint-disable-next-line no-console
    console.info(`%cplayer:%c ${messageText}`, 'color: green', 'color: black');
  }

  private static sendConsoleMessage_Warn(messageText: string): void {
    // eslint-disable-next-line no-console
    console.warn(`%cplayer: %c ${messageText}`, 'color: green', 'color: black');
  }

  private static sendConsoleMessage_Error(messageText: string): void {
    // eslint-disable-next-line no-console
    console.error(`%cplayer: %c ${messageText}`, 'color: green', 'color: black');
  }

  raiseNewStartCommandForTesting(unitDefinition: string) {
    this.sessionId = Math.floor(Math.random() * 20000000 + 10000000).toString();
    const startCommandData: StartCommandData = {
      unitDefinition: unitDefinition,
      unitState: [],
      playerConfig: {
        unitId: '0',
        unitNumber: 0,
        unitTitle: 'Unit 0',
        logPolicy: 'rich',
        pagingMode: 'separate',
        enabledNavigationTargets: [UnitNavigationTarget.END, UnitNavigationTarget.NEXT, UnitNavigationTarget.PREVIOUS],
        startPage: '',
        directDownloadUrl: ''
      }
    };
    this._startCommand.next(startCommandData);
  }
}
