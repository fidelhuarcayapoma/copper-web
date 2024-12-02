import { Status } from "../../../shared/interfaces/status.interface";

export interface Course {
    id: number;
    name: string;
    description: string;
    banner: string;
    duration: number;
    status: Status;
}