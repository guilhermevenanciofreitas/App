import React from 'react';
import { Panel, Breadcrumb } from 'rsuite';
import Calendar from './index.schechule';
import { CustomBreadcrumb } from '../../controls';

const Page = () => {
  return (
    <Panel header={<CustomBreadcrumb title={'Calendário'} />}>
      <Calendar />
    </Panel>
  );
};

export default Page;
