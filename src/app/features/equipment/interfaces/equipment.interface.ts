import { Status } from "../../../shared/interfaces/status.interface";
import { Area } from "../../area/interfaces/area.interface";

export interface Equipment {
  id: number;
  name: string;
  area: Area;
  status: Status;
  createdAt: string;
}