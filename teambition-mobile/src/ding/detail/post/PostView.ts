'use strict';
import {parentView, inject, View, Ding, DetailAPI} from '../../index';
import {IPostData} from 'teambition';

@parentView('DetailView')
@inject([
  'DetailAPI'
])
export class PostView extends View {

  public postTitle: string;
  public postContent: string;
  public post: IPostData;

  private DetailAPI: DetailAPI;
  private id: string;
  private state: string;

  public onInit() {
    this.id = this.$state.params._id;
    this.state = 'origin';
    return this.parent.onInit();
  }

  public onAllChangesDone() {
    this.post = this.parent.detail;
    this.postTitle = this.post.displayedTitle;
    this.postContent = this.post.displayContent;
  }

  public openContentModal() {
    this.openModal('detail/post/post-content-modal.html', {
      scope: this.$scope
    });
    this.state = 'postContent';
    this.setHeader();
  }

  public updatePostTitle() {
    this.DetailAPI.update(this.id, 'post', {
      title: this.postTitle
    })
    .catch((reason: any) => {
      let message = this.getFailureReason(reason);
      this.showMsg('error', '更新标题失败', message);
    });
  }

  private setHeader() {
    if (Ding) {
      switch (this.state) {
        case 'origin':
          Ding.setLeft('返回', true, true, () => {
            window.history.back();
          });
          Ding.setRight('更多', true, false, () => {
            this.parent.showOptions();
          });
          break;
        case 'postContent':
          Ding.setLeft('取消', true, false, () => {
            this.cancelModal();
            this.state = 'origin';
            this.setHeader();
          });
          Ding.setRight('确定', true, false, () => {
            this.updatePostContent();
            this.state = 'origin';
            this.setHeader();
            this.cancelModal();
          });
          break;
      }
    }
  }

  private updatePostContent() {
    this.DetailAPI.update(this.id, 'post', {
      content: this.postContent
    })
    .catch((reason: any) => {
      let message = this.getFailureReason(reason);
      this.showMsg('error', '更新内容失败', message);
    });
  }
}

angular.module('teambition').controller('PostView', PostView);
