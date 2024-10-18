import { Status } from "../../../shared/interfaces/status.interface";
import { MiningUnit } from "../../mining-unit/interfaces/mining-unit.interface";

export interface Area {
  id: number;
  name: string;
  miningUnit: MiningUnit;
  status: Status;
}

