import { Course } from "./course.interface";

export interface Topic {
    id: number;
    name: string;
    courseId: number;
    course: Course;
}