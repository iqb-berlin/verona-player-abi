export interface VeronaResponse {
  id: string;
  value: string;
  status: string;
  subform?: string;
}

export interface ChunkData {
  id: string;
  variables: VeronaResponse[];
}

export enum UnitNavigationTarget {
  NEXT = 'next',
  ERROR = 'error',
  PREVIOUS = 'previous',
  FIRST = 'first',
  LAST = 'last',
  END = 'end',
  MENU = 'menu',
  PAUSE = 'pause'
}

export type ProgressValue = '' | 'none' | 'some' | 'complete';

export interface PlayerConfig {
  unitNumber: number,
  unitTitle: string,
  unitId: string,
  logPolicy: 'lean' | 'rich' | 'debug' | 'disabled',
  pagingMode: 'separate' | 'concat-scroll' | 'concat-scroll-snap',
  enabledNavigationTargets: UnitNavigationTarget[],
  startPage: string,
  directDownloadUrl: string
}

export interface StartCommandData {
  unitDefinition: string,
  unitState: ChunkData[],
  playerConfig: PlayerConfig
}
