import { Course } from "./course.interface";
import { ResourceType } from "./resource-type";

export interface Resource {
    id: number;
    title: string;
    description: string;
    url: string;
    resourceType: ResourceType;
    course: Course;
}