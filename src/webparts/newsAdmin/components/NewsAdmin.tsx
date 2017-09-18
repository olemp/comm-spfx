import * as React from 'react';
import styles from './NewsAdmin.module.scss';
import { INewsAdminProps } from './INewsAdminProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class NewsAdmin extends React.Component<INewsAdminProps, {}> {
  public render(): React.ReactElement<INewsAdminProps> {
    return (
      <div className={styles.newsAdmin}>
        <div className={styles.container}>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-lg10 ms-xl8 ms-xlPush2 ms-lgPush1">
              <span className="ms-font-xl ms-fontColor-white">NewsAdmin</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
