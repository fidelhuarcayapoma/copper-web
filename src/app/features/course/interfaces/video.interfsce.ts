import { Course } from "./course.interface";

export interface Video {
    id: number;
    title: string;
    description: string;
    url: string;
    course: Course;
}