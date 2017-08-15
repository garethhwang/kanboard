'use strict';
import {Ding, inject, View, DetailAPI} from '../../../index';
import {ITaskData} from 'teambition';

@inject([
  'DetailAPI'
])
export class EditDuedateView extends View {
  public task: ITaskData;

  private DetailAPI: DetailAPI;
  private taskid: string;
  private displayDuedate: Date;
  private hasDueDate: boolean;

  public onInit() {
    this.taskid = this.$state.params._id;
    return this.DetailAPI.fetch(this.taskid, 'task')
    .then((task: ITaskData) => {
      this.task = task;
      this.displayDuedate = this.task.displayDuedate;
      this.hasDueDate = !!this.task.dueDate;
    });
  }

  public onAllChangesDone() {
    if (Ding) {
      Ding.setRight('确定', true, false, () => {
        this.updateDueDate();
      });
    }
  }

  public resetDueDate() {
    this.displayDuedate = this.hasDueDate ? this.displayDuedate || new Date() : null;
  }

  private updateDueDate() {
    this.showLoading();
    let displayDuedate = this.displayDuedate ? this.displayDuedate.toISOString() : null;
    this.DetailAPI.update(this.taskid, 'task', {
      dueDate: displayDuedate
    }, 'dueDate')
    .then(() => {
      this.hideLoading();
      window.history.back();
    })
    .catch((reason: any) => {
      let message = this.getFailureReason(reason);
      this.showMsg('error', '更新任务出错', message);
      this.hideLoading();
      window.history.back();
    });
  }
}

angular.module('teambition').controller('EditDuedateView', EditDuedateView);
