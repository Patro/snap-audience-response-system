import React from 'react';
import { shallow } from 'enzyme';
import AbstractTestWrapper from '../utils/AbstractTestWrapper';
import AttendanceCodeTag from './AttendanceCodeTag';

class TestWrapper extends AbstractTestWrapper {
  get text() {
    return this.wrapper.text();
  }

  _render() {
    return shallow(
      <AttendanceCodeTag {...this.props} />
    );
  }
}

describe('AttendanceCodeTag', () => {
  let component;

  beforeEach(() => {
    component = new TestWrapper({ props: {
      attendanceCode: 'AABB',
    } });
  });

  it('renders attendance code', () => {
    expect(component.text).toContain('AABB');
  });
});
