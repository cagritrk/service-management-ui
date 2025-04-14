import { Resource } from './resource.model';

export interface Service {
  id?: string;
  resources: Resource[];
}