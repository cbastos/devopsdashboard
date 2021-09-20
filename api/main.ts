import { Api } from './api';
import { container } from './container';
import TYPES from './container.types';

container.get<Api>(TYPES.Api).init();
