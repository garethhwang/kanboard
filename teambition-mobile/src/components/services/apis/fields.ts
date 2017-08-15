'use strict';

export const fields = {
  activityFileds: '',

  taskFileds: '_executorId,_id,_projectId,_stageId,_tasklistId,content,dueDate,updated,created,note,' +
              'executor,likesCount,likedPeople,isDone,priority,recurrence,linked,isLike,likesGroup,' +
              'involveMembers,subtaskCount,tagIds,visiable,attachmentsCount,objectlinksCount',

  postFileds: '_id,_projectId,attachments,linked,involveMembers,html,postMode,title,updated,creator,content,visiable',

  eventFileds: '_id,_projectId,title,location,content,linked,involveMembers,startDate,endDate,updated,visiable,recurrence',

  workFileds: '_id,_projectId,creator,updated,involveMembers,fileType,fileName,fileSize,' +
              'thumbnail,downloadUrl,linked,previewUrl,fileCategory,visiable,folder',

  entryFileds: '_id,_projectId,_entryCategoryId,amount,content,note,date,status,involveMembers,tags,type,title,visiable',

  projectFileds:  '_id,_defaultCollectionId,_rootCollectionId,created,logo,name,isPublic,' +
                  'organization,py,signCode,isStar,canDelete,canQuit,canArchive',

  projectActivityFileds: '_id,creator,created,title,action,objectType,boundToObjectType,content',

  memberFileds: '_id,name,title,avatarUrl',

  reportFileds: '_id,executor,content,dueDate,project'
};
