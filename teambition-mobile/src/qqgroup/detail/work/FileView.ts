'use strict';
import {parentView, View} from '../../index';
import {IFileData} from 'teambition';

@parentView('DetailView')
export class FileView extends View {

  public file: IFileData;

  public onInit() {
    return this.parent.onInit();
  }

  public onAllChangesDone() {
    this.file = this.parent.detail;
  }
}

angular.module('teambition').controller('FileView', FileView);
