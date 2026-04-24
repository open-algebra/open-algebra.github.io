'use client';

import React from 'react';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { ViewId, TilerProps } from './types';
import { TilerNode } from './TilerNode';
import { resizeByPath, moveLeaf } from './operations';
import { parseDropZoneId, parseTileDragId } from './dnd';
import './style.scss';

type TilerComponent = <T extends ViewId = ViewId>(
    props: TilerProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;

type TilerComponentWithDisplayName = TilerComponent & {
    displayName?: string;
};

const TilerImpl = <T extends ViewId = ViewId>(
    { value, onChange, renderTile, className = '' }: TilerProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
) => {
        const handleDragEnd = (event: DragEndEvent) => {
            const from = parseTileDragId(String(event.operation?.source?.id ?? ''));
            const dropZone = parseDropZoneId(String(event.operation?.target?.id ?? ''));
            if (!from || !dropZone) return;

            const { targetId, position } = dropZone;
            if (from === targetId) return;

            onChange(moveLeaf(value, from, targetId, position));
        };

        const handleClose = (id: T) => {
            // The removeLeaf operation is handled by the consumer
            renderTile(id, false, (closedId) => {
                // This callback will be invoked when a tile is closed
                // The consumer should handle the actual removal via onChange
            });
        };

        const handleResize = (path: string, splitPercentage: number) => {
            onChange(resizeByPath(value, path, splitPercentage));
        };

        return (
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div
                    ref={ref}
                    className={`tiler-root bg-light-subtle flex-grow-1 ${className}`}
                >
                    {value ? (
                        <TilerNode<T>
                            node={value}
                            path=""
                            onClose={handleClose}
                            onResize={handleResize}
                            renderTile={renderTile}
                        />
                    ) : null}
                </div>
            </DragDropProvider>
        );
    };

export const Tiler = React.forwardRef(TilerImpl) as TilerComponentWithDisplayName;

Tiler.displayName = 'Tiler';
