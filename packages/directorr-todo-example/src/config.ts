import { configure, action } from 'mobx';
import { config } from '@nimel/directorr';

configure({ enforceActions: 'observed', useProxies: 'never' });

config.configure({ batchFunction: action });
