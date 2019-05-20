import Immutable from 'immutable';
import arePropsWithImmutablesEqual from './arePropsWithImmutablesEqual';

describe('arePropsWithImmutablesEqual', () => {
  describe('given empty prev and next props', () => {
    let prev, next;

    beforeEach(() => {
      prev = {};
      next = {};
    });

    it('should return true', () => {
      expect(arePropsWithImmutablesEqual(prev, next)).toBe(true);
    });
  });

  describe('given prev props with immutable', () => {
    let prev, next;

    beforeEach(() => {
      prev = {
        data: Immutable.Map({ foo: 'bar' }),
      };
      next = {};
    });

    it('should return false', () => {
      expect(arePropsWithImmutablesEqual(prev, next)).toBe(false);
    });
  });

  describe('given next props with immutable', () => {
    let prev, next;

    beforeEach(() => {
      prev = {};
      next = {
        data: Immutable.Map({ foo: 'bar' }),
      };
    });

    it('should return false', () => {
      expect(arePropsWithImmutablesEqual(prev, next)).toBe(false);
    });
  });

  describe('given prev and next props with equal immutable', () => {
    let prev, next;

    beforeEach(() => {
      prev = {
        data: Immutable.Map({ foo: 'bar' }),
      };
      next = {
        data: Immutable.Map({ foo: 'bar' }),
      };
    });

    it('should return true', () => {
      expect(arePropsWithImmutablesEqual(prev, next)).toBe(true);
    });
  });

  describe('given prev and next props with unequal immutable', () => {
    let prev, next;

    beforeEach(() => {
      prev = {
        data: Immutable.Map({ foo: 'bar' }),
      };
      next = {
        data: Immutable.Map({ foo: 'baz' }),
      };
    });

    it('should return true', () => {
      expect(arePropsWithImmutablesEqual(prev, next)).toBe(false);
    });
  });
});
