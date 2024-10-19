import { Status } from "../../../shared/interfaces/status.interface";

export interface MiningUnit {
  id: number;
  name: string;
  status: Status;
  urlLogo: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}