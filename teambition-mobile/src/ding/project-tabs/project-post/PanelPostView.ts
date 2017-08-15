'use strict';
import {
  parentView,
  inject,
  View,
  Ding,
  nobodyUrl,
  PostAPI,
  MemberAPI
} from '../../index';
import {IPostData, IMemberData} from 'teambition';

let projectId: string;

@parentView('TabsView')
@inject([
  'PostAPI',
  'MemberAPI'
])
export class PanelPostView extends View {

  public posts: IPostData[];

  private PostAPI: PostAPI;
  private MemberAPI: MemberAPI;

  private members: {
    [index: string]: IMemberData;
  };

  public onInit() {
    projectId = this.$state.params._id;
    return this.initFetch();
  }

  public onAllChangesDone() {
    if (Ding) {
      Ding.setLeft('返回', true, true, () => {
        location.href = location.href.replace(window.location.hash, '') + '#/projects';
      });
      Ding.setRight('新建分享', true, false, () => {
        window.location.href = `${window.location.href}/create`;
      });
    }
  }

  public openDetail(postId: string) {
    if (!postId) {
      return;
    }
    window.location.hash = `/detail/post/${postId}`;
  }

  public getAvatar(post: IPostData) {
    let avatarUrl = post.creatorAvatar === nobodyUrl ?
                    this.members[post._creatorId].avatarUrl :
                    post.creatorAvatar;
    return avatarUrl;
  }

  private initFetch() {
    return this.$q.all([
      this.PostAPI.fetchAll(projectId)
      .then((posts: IPostData[]) => {
        this.posts = posts;
      }),
      this.MemberAPI.fetch(projectId)
      .then((members: any) => {
        this.members = members;
      })
    ]);
  }
}

angular.module('teambition').controller('PanelPostView', PanelPostView);
