import { Component, inject, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { TreeModule } from 'primeng/tree';
import { Course } from './interfaces/course.interface';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { CourseService } from './services/course.service';
@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    TreeModule,
    CommonModule,
    ReactiveFormsModule,
    CourseFormComponent
  ],
  providers: [
    DialogService, 
    MessageService, 
    CourseService,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent implements OnInit {
  items = new Array(10);

  nodes!: TreeNode[];
  courses: Course[] = [];
  showDialog = false;
  courseForm!: FormGroup;
  dialogService = inject(DialogService);
  courseService = inject(CourseService);
  isLoading = true;


  showAddCourseDialog() {
    this.showDialog = true;
  }

  save(event: any) {
    if (this.courseForm.valid) {
      const course = event.value;

      this.courseService.createCourse(course).subscribe((course) => {
        this.courses.push(course);
        this.courseForm.reset();
        this.isLoading = false;
      })
      this.showDialog = false;

    }
  }

  close() {
    this.showDialog = false;
    this.courseForm.reset();
  }
  ngOnInit() {
    this.courseForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      banner: new FormControl('', Validators.required)
    });
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.isLoading = false;
      }
      
    });

  }
}
