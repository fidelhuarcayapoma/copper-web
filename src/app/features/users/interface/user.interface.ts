import { Status } from "../../../shared/interfaces/status.interface";

export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    roles: Role[];
    dni: string;
    status: Status;
    createdAt: string;
}

export interface Role {
    id: number;
    code: string;
    description: string;
}