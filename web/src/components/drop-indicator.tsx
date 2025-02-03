import { css, cx } from '@linaria/core';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';
import { type JSX } from 'solid-js';

type Orientation = 'horizontal' | 'vertical';

const edgeToOrientationMap: Record<Edge, Orientation> = {
  top: 'horizontal',
  bottom: 'horizontal',
  left: 'vertical',
  right: 'vertical',
};

const horizontalStyle = css`
  height: var(--line-thickness);
  left: var(--terminal-radius);
  right: 0;

  &::before {
    left: var(--negative-terminal-size);
  }
`;

const verticalStyle = css`
  width: var(--line-thickness);
  top: var(--terminal-radius);
  bottom: 0;

  &::before {
    top: var(--negative-terminal-size);
  }
`;

const edgeStyles: Record<Edge, string> = {
  top: css`
    top: var(--line-offset);

    &::before {
      top: var(--offset-terminal);
    }
  `,
  right: css`
    right: var(--line-offset);

    &::before {
      right: var(--offset-terminal);
    }
  `,
  bottom: css`
    bottom: var(--line-offset);

    &::before {
      bottom: var(--offset-terminal);
    }
  `,
  left: css`
    left: var(--line-offset);

    &::before {
      left: var(--offset-terminal);
    }
  `,
};

const baseStyle = css`
  position: absolute;
  z-index: 10;
  background-color: #1e40af; /* Equivalent to bg-blue-700 */
  pointer-events: none;

  &::before {
    content: '';
    width: var(--terminal-size);
    height: var(--terminal-size);
    box-sizing: border-box;
    position: absolute;
    border-width: var(--line-thickness);
    border-style: solid;
    border-color: #1e40af;
    border-radius: 50%;
  }
`;

const strokeSize = 2;
const terminalSize = 8;
const offsetToAlignTerminalWithLine = (strokeSize - terminalSize) / 2;

export function DropIndicator(props: { edge: Edge; gap: string }) {
  const orientationStyle =
    edgeToOrientationMap[props.edge] === 'horizontal' ? horizontalStyle : verticalStyle;
  const edgeStyle = edgeStyles[props.edge]
  return (
    <div
      style={
        {
          '--line-thickness': `${strokeSize}px`,
          '--line-offset': `calc(-0.5 * (${props.gap} + ${strokeSize}px))`,
          '--terminal-size': `${terminalSize}px`,
          '--terminal-radius': `${terminalSize / 2}px`,
          '--negative-terminal-size': `-${terminalSize}px`,
          '--offset-terminal': `${offsetToAlignTerminalWithLine}px`,
        } as JSX.CSSProperties
      }
      class={cx(baseStyle, orientationStyle, edgeStyle)}
    />
  );
}
