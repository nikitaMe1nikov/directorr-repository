import { createContext } from 'react';
import { createUseStoreHooks } from '@nimel/directorr-react';

const context = createContext<any>(null);
export const { Provider } = context;
export const useStore = createUseStoreHooks(context);
