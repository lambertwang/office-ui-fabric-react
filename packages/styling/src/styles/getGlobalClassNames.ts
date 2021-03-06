import { ITheme } from '../interfaces/index';

import { Stylesheet } from '@uifabric/merge-styles';
import { memoizeFunction } from '@uifabric/utilities';

export type GlobalClassNames<IStyles> = Record<keyof IStyles, string>;

/**
 * Checks for the `disableGlobalClassNames` property on the `theme` to determine if it should return `classNames`
 * Note that calls to this function are memoized.
 *
 * @param classNames The collection of global class names that apply when the flag is false. Make sure to pass in
 * the same instance on each call to benefit from memoization.
 * @param theme The theme to check the flag on
 * @param disableGlobalClassNames Optional. Explicitly opt in/out of disabling global classnames. Defaults to false.
 */
export const getGlobalClassNames: <T>(
  classNames: GlobalClassNames<T>,
  theme: ITheme,
  disableGlobalClassNames?: boolean
) => Partial<GlobalClassNames<T>> = memoizeFunction(
  <T>(
    classNames: GlobalClassNames<T>,
    theme: ITheme,
    disableGlobalClassNames?: boolean
  ): Partial<GlobalClassNames<T>> => {
    const styleSheet = Stylesheet.getInstance();

    if (disableGlobalClassNames || (disableGlobalClassNames === undefined && theme.disableGlobalClassNames)) {
      // disable global classnames
      return Object.keys(classNames).reduce((acc: {}, className: string) => {
        acc[className] = styleSheet.getClassName(classNames[className]);
        return acc;
      }, {});
    }

    // use global classnames
    return classNames;
  }
);
