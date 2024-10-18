import { Status } from "../../../shared/interfaces/status.interface";
import { Equipment } from "../../equipment/interfaces/equipment.interface";

export interface Craft {
  id: number;
  name: string;
  equipment: Equipment;
  status: Status;
  createdAt: string;
}