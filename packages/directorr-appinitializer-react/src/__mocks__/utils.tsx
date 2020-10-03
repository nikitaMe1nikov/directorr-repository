import React, { ReactElement } from 'react';
import { Directorr } from '@nimel/directorr';
import { DirectorrProvider } from '@nimel/directorr-react';
import { mount } from 'enzyme';

export function createDirectorr() {
  return new Directorr();
}

export function mountWithDirectorr(children: ReactElement<any>, directorr: Directorr) {
  const wrappingComponent = ({ children }) => (
    <DirectorrProvider value={directorr}>{children}</DirectorrProvider>
  );
  const root = mount(children, { wrappingComponent });

  return root.children();
}
