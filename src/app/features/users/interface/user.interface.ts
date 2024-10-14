export interface User {
    id: number;
    name: string;
    lastName: string;
    email: string;
    roles: Role[];
    createdDate: string;
}

export interface Role {
    id: number;
    code: string;
    description: string;
}