'use strict';
import {mapfile} from './mapfile';
import {IProjectActivitiesData, IFileData, IMemberData} from 'teambition';

export const PAParser = (activity: IProjectActivitiesData) => {
  activity.creatorId = activity.creator._id;
  activity.creatorName = activity.creator.name;
  activity.avatarUrl = activity.creator.avatarUrl;
  activity.icon = mapfile(activity.boundToObjectType);
  activity.type = activity.boundToObjectType;
  let objects: any = activity.content.objects;
  activity.files = [];
  if (objects.length) {
    let first = objects[0];
    if (activity.type === 'work') {
      angular.forEach(objects, (object: IFileData, index: number) => {
        let fileObject = {
          fileType: '',
          thumbnailUrl: '',
          fileName: '',
          objectHref: '',
          folder: '',
          class: ''
        };
        if (object.fileType.length > 4) {
          fileObject.fileType = object.fileType.charAt(0);
          fileObject.class = 'bigger-bigger';
        }else {
          fileObject.fileType = object.fileType;
        }
        fileObject.thumbnailUrl = object.thumbnailUrl;
        fileObject.fileName = object.fileName;
        fileObject.folder = object.folder;
        if (object._id) {
          fileObject.objectHref = `/detail/work/${object._id}`;
        }else {
          fileObject.objectHref = 'deleted';
        }
        activity.files.push(fileObject);
      });
    }else {
      activity.objectContent = first.content || first.title;
      activity.postTitle = first.title;
      if (first._id) {
        activity.objectHref = `/detail/${activity.boundToObjectType}/${first._id}`;
      }else {
        activity.objectHref = 'deleted';
      }
      if (activity.boundToObjectType === 'task') {
        activity.isDone = (activity.action === 'activity.task.update.done');
        activity.icon = activity.isDone ? mapfile('redo_task') : activity.icon;
      }else if (activity.boundToObjectType === 'project') {
        if (activity.action === 'activity.project.member.create') {
          let content: string[] = [];
          activity.icon = mapfile('add_member');

          angular.forEach(objects, (object: IMemberData, index: number) => {
            object.name = (!object.name) ? '用户名出错' : object.name;
            content.push(object.name);
          });
          activity.objectContent = content.join('、');
          activity.postTitle = content.join('、');
          activity.objectHref = '#';
        }
      }
    }
  }
  return activity;
};
