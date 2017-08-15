'use strict';

import {
  inject,
  app,
  getParam,
  Ding,
  View,
  RestAPI,
  socketListener,
  MessageAPI
} from './';
import {IUserMe, IMessageData, IRootScope} from 'teambition';

declare let Spiderjs: any;
export let spider: any;

@inject([
  'app',
  '$http',
  'socket',
  'RestAPI',
  'MessageAPI'
])
export class RootView extends View {

  public userMe: IUserMe;

  public $state: angular.ui.IStateService;

  public $http: angular.IHttpService;
  public socket: any;
  public RestAPI: RestAPI;
  public MessageAPI: MessageAPI;

  public onInit(): angular.IPromise<any> {
    let visible = getParam(window.location.hash, 'visible');
    if (!visible) {
      this.zone.hasCreated = true;
      if (this.userMe && this.$rootScope.pending) {
        return this.$rootScope.pending;
      }
      return this.RestAPI.get({
        Type: 'users',
        Id: 'me'
      })
      .$promise
      .then((userMe: IUserMe) => {
        this.initUser(userMe);
      })
      .catch((reason: any) => {
        const defer = this.$q.defer();
        if (Ding) {
          Ding.getCode((code: string) => {
            const DingCorpid = Ding.corpId;
            this.$http.get(`${app.dingApiHost}/getAccess?code=${code}&corpId=${DingCorpid}`)
            .then((result: any) => {
              defer.resolve();
            })
            .catch((reason: any) => {
              let message = this.getFailureReason(reason);
              this.showMsg('error', 'error', message);
            });
          });
        }else {
          this.showMsg('error', 'error', '应用无法初始化');
        }
        return defer.promise;
      })
      .then(() => {
        if (!this.userMe) {
          return this.RestAPI.get({
            Type: 'users',
            Id: 'me'
          })
          .$promise
          .then((userMe: IUserMe) => {
            this.initUser(userMe);
          })
          .catch((reason: any) => {
            let message = this.getFailureReason(reason);
            this.showMsg('error', 'error', message);
          });
        }
      })
      .catch((reason: any) => {
        let message = this.getFailureReason(reason);
        this.showMsg('error', 'error', message);
      });
    }
  }

  public onAllChangesDone() {
    socketListener('new', 'message', (type: string, data: any) => {
      this.MessageAPI.getOne(data.msgId)
      .then((message: IMessageData) => {
        if (message.latestActivity && message.latestActivity.creator && message.latestActivity.creator._id !== this.userMe._id) {
          this.showMsg('success', message.creator.name, data.title, `#/detail/${message.boundToObjectType}/${message._boundToObjectId}`);
        }
      });
    });
    socketListener('change', 'message', (type: string, data: any) => {
      this.MessageAPI.getOne(data.msgId)
      .then((message: IMessageData) => {
        if (message.latestActivity && message.latestActivity.creator && message.latestActivity.creator._id !== this.userMe._id) {
          this.showMsg('success', message.creator.name, data.title, `#/detail/${message.boundToObjectType}/${message._boundToObjectId}`);
        }
      });
    });
  }

  private initRootscope(userMe: IUserMe): void {
    let $rootScope: IRootScope = this.$rootScope;
    $rootScope.global = {
      title: 'Teambition'
    };
    $rootScope.userMe = userMe;
    app.socket = this.socket(userMe.snapperToken);
  }

  private initUser(userMe: IUserMe) {
    if (!userMe) {
      this.goHome();
    }else {
      this.initRootscope(userMe);
      this.userMe = userMe;
      try {
        let spiderOptions = {
          _userId: userMe._id,
          client: 'c6a5c100-73b3-11e5-873a-57bc512acffc',
          host: app.spiderHost
        };
        spider = new Spiderjs(spiderOptions);
      } catch (error) {
        console.error(error);
      }
      let hash = window.location.hash;
      if (!hash) {
        this.$state.go('projects');
      }
    }
  }

  private goHome(): void {
    window.location.hash = '/login';
  }

}

angular.module('teambition').controller('RootView', RootView);

export * from './project/ProjectView';
export * from './project-tabs/TabsView';
export * from './project-tabs/project-home/PanelHomeView';
export * from './project-tabs/project-event/PanelEventView';
export * from './project-tabs/project-post/PanelPostView';
export * from './project-tabs/project-tasklist/PanelTasklistView';
export * from './project-tabs/project-work/PanelWorkView';
export * from './detail/DetailView';
export * from './edit/content/EditContentView';
export * from './edit/position/TaskPositionSelector';
export * from './edit/projects/ChooseProjectsView';
export * from './edit/stage/ChooseStageView';
export * from './edit/tasklist/ChooseTasklistView';
export * from './create/event/CreateEventView';
export * from './create/post/CreatePostView';
export * from './create/project/CreateProjectView';
export * from './create/task/CreateTaskView';
