import { Component, inject, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { PRIMENG_MODULES } from '../../primeng.imports';
import { TreeModule } from 'primeng/tree';
import { Course } from './interfaces/course.interface';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { CourseService } from './services/course.service';
import { CrudComponent } from '../../core/components/crud/crud';
import { StatusService } from '../../shared/service/status.service';
import { Status } from '../../shared/interfaces/status.interface';
import { StatusComponent } from "../../shared/components/status/status.component";
@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    TreeModule,
    CommonModule,
    ReactiveFormsModule,
    CourseFormComponent,
    StatusComponent
],
  providers: [
    DialogService,
    MessageService,
    CourseService,
    ConfirmationService,
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent  implements OnInit {

  nodes!: TreeNode[];
  courses: Course[] = [];
  showDialog = false;
  courseForm!: FormGroup;
  dialogService = inject(DialogService);
  courseService = inject(CourseService);
  confirmationService = inject(ConfirmationService);
  statusService = inject(StatusService);
  isLoading = true;

  items = new Array(6);
  statuses : Status[] = []

  showAddCourseDialog() {
    this.showDialog = true;
  }
  editCourse(course: Course) {
    this.showDialog = true;
    this.courseForm.patchValue(
      {
        ...course,
        statusId: course?.status?.id,
      }
    );
  }

  save(event: any) {
    const course = event.value;
    const courseId = course?.id;
    if(this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
  
    if (!courseId) {
      this.courseService.createCourse(course).subscribe((newCourse) => {
        const index = this.courses.findIndex(c => c.id === courseId);
        if (index !== -1) {
          this.courses[index] = newCourse;  // Reemplaza el curso existente
        } else {
          this.courses.push(newCourse);  // Agrega el nuevo curso
        }
        this.courseForm.reset();
        this.isLoading = false;
      });
      this.showDialog = false;
    }else {
      this.courseService.updateCourse(courseId, course).subscribe((updatedCourse) => {
        const index = this.courses.findIndex(c => c.id === courseId);
        this.courses[index] = updatedCourse;
        this.courseForm.reset();
        this.isLoading = false;
      });
      this.showDialog = false;
    }
  }
  

  close() {
    this.showDialog = false;
    this.courseForm.reset();
  }
  ngOnInit() {
    this.courseForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      banner: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      statusId: new FormControl(null),
    });
    this.loadCourses();
    this.loadStatuses();
  }
  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.isLoading = false;
      }

    });
  }

  loadStatuses(): void {
    this.statusService.getAll().subscribe({
      next: (statuses) => {
        this.statuses = statuses;
      }
    })
  }

}
