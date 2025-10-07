import { themeQuartz, EditStrategyType } from 'ag-grid-community';
import { AG_GRID_LOCALE_ES } from './locale/es-ES';

export const GRID_THEME = themeQuartz.withParams({
    backgroundColor: '#FFFFFF',
    foregroundColor: '#7E2E84',
    headerTextColor: '#FFFFFF',
    headerBackgroundColor: '#DD9BEEFF',
    oddRowBackgroundColor: '#FFFFFF',
    headerColumnResizeHandleColor: '#7E2E84',
});
export const GRID_LOCALE = AG_GRID_LOCALE_ES;
export const GRID_EDIT_TYPE: EditStrategyType = "fullRow";