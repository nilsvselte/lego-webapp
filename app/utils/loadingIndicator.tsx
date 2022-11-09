import { get } from 'lodash';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { Props } from 'app/components/LoadingIndicator';
import type { ComponentType } from 'react';
/**
 * A higher order component that wraps the given component in
 * LoadingIndicator while `props[loadingProp]` is being fetched.
 */

export default function loadingIndicator(
  loadingProps: Array<string>,
  options?: Props
): ComponentType<any | string> {
  return (Component: ComponentType<any>) => {
    const Composed = (props: Record<string, any>) => (
      <LoadingIndicator
        {...options}
        loading={
          loadingProps.filter((loadingProp) => !get(props, loadingProp))
            .length !== 0
        }
      >
        <Component {...props} />
      </LoadingIndicator>
    );

    const name = Component.displayName || Component.name || 'Component';
    Composed.displayName = `Loading${name}`;
    return Composed;
  };
}
