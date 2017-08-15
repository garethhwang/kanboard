'use strict';
import {View, inject, DetailAPI, ProjectsAPI, TasklistAPI} from '../../index';
import {IProjectData, ITasklistData} from 'teambition';

@inject([
  'DetailAPI',
  'ProjectsAPI',
  'TasklistAPI'
])
export class ChooseProjectsView extends View {
  public detail: any;
  public personalProjects: IProjectData[] = [];
  public projects: IProjectData[] = [];

  private DetailAPI: DetailAPI;
  private ProjectsAPI: ProjectsAPI;
  private TasklistAPI: TasklistAPI;
  private boundToObjectType: string;
  private boundToObjectId: string;
  private organization: {
    [index: string]: {
      id: string;
      name: string;
      projects: IProjectData[];
    }
  } = {};

  public onInit() {
    this.boundToObjectId = this.$state.params._id;
    this.boundToObjectType = this.$state.params.type;
    return this.$q.all([
      this.DetailAPI.fetch(this.boundToObjectId, this.boundToObjectType)
      .then((detail: any) => {
        this.detail = detail;
      }),
      this.ProjectsAPI.fetch()
      .then((projects: IProjectData[]) => {
        this.projects = projects;
      })
    ])
    .then(() => {
      this.sortProject(this.projects);
    });
  }

  public changeProject(id: string) {
    if (this.detail._projectId !== id) {
      this.showLoading();
      this.TasklistAPI.fetchAll(id)
      .then((tasklists: ITasklistData[]) => {
        return tasklists[0];
      })
      .then((tasklist: ITasklistData) => {
        let stageId = tasklist.hasStages[0]._id;
        this.DetailAPI.update(this.boundToObjectId, this.boundToObjectType, {
          _stageId: stageId
        }, 'move')
        .then(() => {
          this.hideLoading();
          this.showMsg('success', '移动任务成功', '');
          window.history.back();
        })
        .catch((reason: any) => {
          this.hideLoading();
          let message = this.getFailureReason(reason);
          this.showMsg('error', message, '移动任务失败');
          window.history.back();
        });
      });
    }
  }

  private sortProject(projects: IProjectData[]) {
    angular.forEach(projects, (project: any, index: number) => {
      project.isSelected = this.detail._projectId === project._id;
      if (project.organization) {
        this.organization[project.organization._id] = this.organization[project.organization._id] ? this.organization[project.organization._id] : {
          id: project.organization._id,
          name: project.organization.name,
          projects: []
        };
        this.organization[project.organization._id].projects.push(project);
      }else {
        this.personalProjects.push(project);
      }
    });
  }
}

angular.module('teambition').controller('ChooseProjectsView', ChooseProjectsView);
