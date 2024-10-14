import { StatusCode } from "../common/status-code";

export interface Status{
    id: number;
    code: StatusCode;
    description: string;
}