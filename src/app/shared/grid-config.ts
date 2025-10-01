import { themeQuartz, colorSchemeDarkBlue, EditStrategyType } from 'ag-grid-community';
import { AG_GRID_LOCALE_ES } from './locale/es-ES';

export const GRID_THEME = themeQuartz.withPart( colorSchemeDarkBlue );
export const GRID_LOCALE = AG_GRID_LOCALE_ES;
export const GRID_EDIT_TYPE: EditStrategyType = "fullRow";