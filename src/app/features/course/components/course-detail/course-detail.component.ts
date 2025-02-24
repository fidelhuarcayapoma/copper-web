import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ResourceService } from '../../services/resource.service';
import { Course } from '../../interfaces/course.interface';
import { ConfirmationService, MenuItem, MessageService, TreeNode } from 'primeng/api';
import { PRIMENG_MODULES } from '../../../../primeng.imports';
import { TreeModule } from 'primeng/tree';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { TopicService } from '../../services/topic.service';
import { TopicFormComponent } from '../topic-form/topic-form.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SafePipe } from '../../../../core/pipes/safe-pipe.pipe';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { ResourceFormComponent } from '../resource-form/resource-form.component';
import { Resource } from '../../interfaces/video.interfsce';
import { ResourceCode } from '../../../../shared/common/resource-code';
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    ...PRIMENG_MODULES,
    TreeModule,
    DividerModule,
    CommonModule,
    TopicFormComponent,
    SafePipe,
    ContextMenuModule,
    ResourceFormComponent,
  ],
  providers: [
    ConfirmationService,
    ResourceService,
    CourseService,
    TopicService,
    MessageService,
    DialogService,

  ],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  resourceService = inject(ResourceService);
  courseService = inject(CourseService);
  topicService = inject(TopicService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  cd = inject(ChangeDetectorRef);

  courseId: number | null = null;
  nodes!: TreeNode[];
  course: Course | null = null;
  resources: Resource[] = [];
  items = new Array(5);
  loading = true;

  topicForm!: FormGroup;
  contextMenuItems: MenuItem[] = [];
  selectedNode: TreeNode | null = null;
  showVideoFormDialog = false;
  resourceForm!: FormGroup;

  showDialog = false;
  showVideoDialog = false;
  selectedVideo: any = null;
  resourceCode: ResourceCode = ResourceCode.FILE;
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap?.get('id'));
    if (!this.courseId) {
      return;
    }

    this.courseService.getCourse(this.courseId).subscribe(course => this.course = course);
    this.loadTopics();

    this.topicForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });

    this.resourceForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      url: new FormControl(null, [Validators.required]),
    });
    this.initializeContextMenu();
  }

  loadTopics() { 
    if (!this.courseId) return;
  
    this.topicService.getTopicsByCourseId(this.courseId).subscribe(topics => {
      this.nodes = topics.map(topic => ({
        key: topic.id + '',
        label: topic.name,
        children: [
          {
            key: `videos-${topic.id}`,
            label: 'Clases grabadas',
            children: [],
            icon: 'pi pi-video',
            leaf: false
          },
          {
            key: `resources-${topic.id}`,
            label: 'Recursos descargables',
            children: [],
            icon: 'pi pi-file',
            leaf: false
          }
        ],
        leaf: false
      }));
  
      this.loading = false;
    });
  }
  
  onNodeExpand(event: any) {
    const node = event.node;
  
    if (node.children.length === 0) {
      node.children = [{ key: 'loading', label: 'Cargando...', icon: 'pi pi-spin pi-spinner', leaf: true }];
  
      const topicId = parseInt(node.key.split('-')[1]);
  
      this.resourceService.getVideosByCourseId(topicId).subscribe({
        next: (resources) => {
          // Filtrar SOLO videos si el nodo expandido es "Clases grabadas"
          let filteredResources = resources;
          if (node.label === 'Clases grabadas') {
            filteredResources = resources.filter(resource => resource.resourceType.code === 'VIDEO');
          }else if (node.label === 'Recursos descargables') {
            filteredResources = resources.filter(resource => resource.resourceType.code !== 'VIDEO');
          }
  
          node.children = filteredResources.map(resource => ({
            key: `resource-${resource.id}`,
            label: resource.title,
            type: resource.resourceType.code?.toLowerCase(),
            data: this.convertVideoUrl(resource.url),
            icon: `pi pi-fw pi-${resource.resourceType.code === 'VIDEO' ? 'vimeo' : 'file-pdf'}`,
            leaf: true
          }));
  
          if (node.children.length === 0) {
            node.children = [{ key: 'empty', label: 'No hay recursos disponibles', icon: 'pi pi-info-circle', leaf: true }];
          }
        },
        error: () => {
          node.children = [];
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar los recursos'
          });
        }
      });
    }
  }
  
  

  showAddTopicDialog() {
    this.showDialog = true;
    this.topicForm.reset();
  }

  save(event: any) {
    if (this.topicForm.valid && this.courseId) {
      const topic = event.value;
      topic.courseId = this.courseId;

      this.topicService.createTopic(topic).subscribe(
        (newTopic) => {
          // Agregar el nuevo tema al árbol
          const newNode: TreeNode = {
            key: newTopic.id + '',
            label: newTopic.name,

            children: [],
            leaf: false
          };

          this.nodes = [...this.nodes, newNode];

          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tema creado correctamente'
          });

          this.topicForm.reset();
          this.showDialog = false;
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al crear el tema'
          });
        }
      );
    }
  }

  close() {
    this.showDialog = false;
    this.topicForm.reset();
  }

  onNodeSelect(event: any) {
    const node = event.node;
    if (node.type === 'video') {
      this.selectedVideo = node;
      this.showVideoDialog = true;
    }
  }

  onVideoDialogHide() {
    this.selectedVideo = null;
  }
  private initializeContextMenu() {
    this.contextMenuItems = [
      {
        label: 'Agregar Video',
        icon: 'pi pi-video',
        command: () => {
          if (this.selectedNode && !this.selectedNode.type) {
            this.resourceCode = ResourceCode.VIDEO;
            this.showAddVideoDialog();
          }
        }
      },
      {
        label: 'Agregar Archivo',
        icon: 'pi pi-file',
        command: () => {
          if (this.selectedNode && !this.selectedNode.type) {
            this.resourceCode = ResourceCode.FILE;
            this.showAddFileDialog();
          }
        }
      },
      {
        separator: true
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: (event) => {
          if (this.selectedNode && !this.selectedNode.type) {
            this.deleteTopic();
          } else if (this.selectedNode?.type === ResourceCode.PDF || this.selectedNode?.type?.toLocaleUpperCase() === ResourceCode.VIDEO) {
            if (!this.selectedNode?.key) {
              return;
            } 

            this.deleteResource(this.selectedNode.key)
          }
        }
      }
    ];
  }

  onContextMenuSelect(event: any) {
    console.log(event);
    this.selectedNode = event.node;
  }

  showAddVideoDialog() {
    this.resourceForm.reset();
    this.showVideoFormDialog = true;
  }
  showAddFileDialog() {
    this.resourceForm.reset();
    this.showVideoFormDialog = true;
  }
  closeVideoFormDialog() {
    this.showVideoFormDialog = false;
    this.resourceForm.reset();
  }

  saveResource(form: FormGroup) {
    if (form.invalid || !this.selectedNode?.key) {
      return
    }
    const resourceData = {
      ...form.value,
      topicId: parseInt(this.selectedNode.key)
    };

    this.resourceService.createResource(resourceData).subscribe({
      next: (res) => {
        let message = '';
        let videoNode = null;
        if (this.resourceCode === ResourceCode.FILE) {
          message = 'Archivo agregado correctamente';
          videoNode = {
            key: `file-${res.id}`,
            label: res.title,
            type: res.resourceType.code?.toLocaleLowerCase(),
            data: res.url,
            icon: 'pi pi-fw pi-file-pdf',
            leaf: true
          };

        } else if (this.resourceCode === ResourceCode.VIDEO) {
          message = 'Video agregado correctamente';
          videoNode = {
            key: `video-${res.id}`,
            label: res.title,
            type: res.resourceType.code?.toLocaleLowerCase(),
            data: this.convertVideoUrl(res.url),
            icon: 'pi pi-fw pi-vimeo',
            leaf: true
          };
        }
        if (this.selectedNode && videoNode) {
          this.selectedNode.children = [...(this.selectedNode.children || []), videoNode];
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: message
        });

        this.showVideoFormDialog = false;
        this.resourceForm.reset();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al agregar el video'
        });
      }
    });

  }

  deleteTopic() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este tema y todos sus videos?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!this.selectedNode || !this.selectedNode.key) {
          return;
        }
        const topicId = parseInt(this.selectedNode?.key);
        this.topicService.deleteTopic(topicId).subscribe({
          next: () => {
            this.nodes = this.nodes.filter(node => node.key !== this.selectedNode!.key);
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Tema eliminado correctamente'
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el tema'
            });
          }
        });
      }
    });

  }

  deleteResource(key: string): void {
    const idResource = parseInt(key.split('-')[1]);
    this.resourceService.delete(idResource).subscribe({
      next: () => {
        // Se actualiza el árbol eliminando el nodo con la key indicada
        this.nodes = this.removeNode(this.nodes, key);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Recurso eliminado correctamente'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar el recurso'
        });
      }
    });
  }
  
  

  private convertVideoUrl(url: string): string {
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      const vimeoId = vimeoMatch[1];
      return `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
    }

    const youtubePatterns = [
      /youtu\.be\/([^?]+)/, // Para URLs tipo youtu.be
      /youtube\.com\/watch\?v=([^&]+)/, // Para URLs tipo youtube.com/watch?v=
      /youtube\.com\/embed\/([^?]+)/ // Para URLs que ya están en formato embed
    ];

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        const youtubeId = match[1];
        return `https://www.youtube.com/embed/${youtubeId}`;
      }
    }

    return url;
  }

private removeNode(nodes: TreeNode[], key: string): TreeNode[] {
  return nodes.reduce((acc: TreeNode[], node: TreeNode) => {
    // Si la key del nodo coincide, se omite (no se agrega al acumulador)
    if (node.key === key) {
      return acc;
    }
    // Si tiene hijos, se recorre recursivamente
    if (node.children && node.children.length) {
      node.children = this.removeNode(node.children, key);
    }
    acc.push(node);
    return acc;
  }, []);
}

}