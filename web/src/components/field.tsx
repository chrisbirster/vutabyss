import { css, cx } from '@linaria/core';
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { pointerOutsideOfPreview } from '@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import GripVertical from 'lucide-solid/icons/grip-vertical';
import { createEffect, createSignal, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import invariant from 'tiny-invariant';
import { DropIndicator } from './drop-indicator';
import { getFieldData, isFieldData } from './field-data';
import { TField, FieldType } from '@/types';
import { Settings } from 'lucide-solid';

const fieldContainer = css`
  display: flex;
  align-items: center;
  flex-direction: row;
  background: white;
  border: 1px solid;
  border-radius: 4px;
  padding: 8px;
  padding-left: 0;
  cursor: grab;

  &:hover {
    background-color: #f1f5f9;
  }

  &:hover .grabber {
    opacity: 1;
  }
`;

const draggingStyle = css`
  opacity: 0.4;
`;

const iconWrapper = css`
  padding: 0 2px;
  width: 24px;
  display: flex;
  justify-content: center;
`;

const contentWrapper = css`
  flex-grow: 1;
  flex-shrink: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const previewContainer = css`
  border: 1px solid;
  border-radius: 4px;
  padding: 8px;
  background: white;
`;

const inputField = css`
  width: 100%;
  margin: 0 10px;
  border-radius: 8px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const grabHandle = css`
  opacity: 0; 
  transition: opacity 0.2s ease-in-out;
`;

const advancedSettingsStyle = css`
  position: absolute;
  top: 100%; 
  left: 0;
  width: 100%;
  background: #f1f5f9;
  border: 1px solid #ccc;
  border-top: none;
  padding: 8px;
  box-sizing: border-box;
  z-index: 5;
`;

// Type narrowing is tricky with Solid's signal accessors
interface FieldState {
  type: 'idle' | 'preview' | 'is-dragging' | 'is-dragging-over';
  container?: HTMLElement;
  closestEdge?: Edge | null;
}

const idle: FieldState = { type: 'idle' };

export const Field = (props: { field: TField }) => {
  let ref: HTMLDivElement | undefined = undefined;
  const [state, setState] = createSignal<FieldState>(idle);
  const [showAdvancedSettings, setShowAdvancedSettings] = createSignal(false);

  createEffect(() => {
    const element = ref;
    const field = props.field
    invariant(element);

    draggable({
      element,
      getInitialData() {
        return getFieldData(field);
      },
      onGenerateDragPreview({ nativeSetDragImage }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: pointerOutsideOfPreview({
            x: '16px',
            y: '8px',
          }),
          render({ container }) {
            setState({ type: 'preview', container });
          },
        });
      },
      onDragStart() {
        setState({ type: 'is-dragging' });
      },
      onDrop() {
        setState(idle);
      },
    });

    dropTargetForElements({
      element,
      canDrop({ source }) {
        return source.element !== element && isFieldData(source.data);
      },
      getData({ input }) {
        const data = getFieldData(field);
        return attachClosestEdge(data, {
          element,
          input,
          allowedEdges: ['top', 'bottom'],
        });
      },
      getIsSticky() {
        return true;
      },
      onDragEnter({ self }) {
        const edge = extractClosestEdge(self.data);
        setState({ type: 'is-dragging-over', closestEdge: edge });
      },
      onDrag({ self }) {
        const closestEdge = extractClosestEdge(self.data);
        setState((current) =>
          current.type === 'is-dragging-over' && current.closestEdge === closestEdge
            ? current
            : { type: 'is-dragging-over', closestEdge }
        );
      },
      onDragLeave() {
        setState(idle);
      },
      onDrop() {
        setState(idle);
      },
    });
  });

  return (
    <>
      <div style={{ position: "relative" }}>
        <div
          data-task-id={props.field.type.id}
          ref={ref}
          class={cx(fieldContainer, (state().type === 'is-dragging' && draggingStyle))}
        >
          <div class={cx(iconWrapper, "grabber", grabHandle)}><GripVertical /></div>
          <span class={contentWrapper}>{<props.field.type.logo />}</span>
          <input
            class={inputField}
            type="text"
            required
            spellcheck={false}
            placeholder="Field name"
            value={props.field.name}
          />
          <div class={iconWrapper}
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings())}
          >
            <Settings />
          </div>
        </div>
        {/* Advanced Settings Panel */}
        <Show when={showAdvancedSettings()}>
          <div class={advancedSettingsStyle}>
            {/* Add your extra options here */}
            <div>Advanced Option 1</div>
            <div>Advanced Option 2</div>
            <div>Advanced Option 3</div>
          </div>
        </Show>

        <Show when={state().type === 'is-dragging-over' && state().closestEdge} fallback={null}>
          <DropIndicator edge={state().closestEdge!} gap={'8px'} />
        </Show>
      </div>
      <Show when={state().type === 'preview'} fallback={null}>
        <Portal mount={state().container}>
          <DragPreview fieldType={props.field.type} />
        </Portal>
      </Show>
    </>
  );
}

// A simplified version of our field type for the user to drag around
function DragPreview(props: { fieldType: FieldType }) {
  return <div class={previewContainer}>
    <span>{<props.fieldType.logo />}</span>
    <span>{props.fieldType.label}</span>
  </div>;
}
