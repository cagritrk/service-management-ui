import { Owner } from './owner.model';

export interface Resource {
  id?: string;
  owners: Owner[];
}