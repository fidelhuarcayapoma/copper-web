import { Status } from "../../../shared/interfaces/status.interface";
import { Craft } from "../../craft/interfaces/craft.interface";

export interface Document {
  id: number;
  name: string;
  url: string;
  craft: Craft;
  status: Status;
  createdAt: string;
  craftId: number;
  files: File[];
}