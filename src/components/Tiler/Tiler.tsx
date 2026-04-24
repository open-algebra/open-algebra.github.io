'use client';

import React from 'react';
import { DragDropProvider, DragEndEvent } from '@dnd-kit/react';
import { WindowNode, ViewId, TilerProps } from './types';
import { TilerNode } from './TilerNode';
import { resizeByPath, swapLeaves } from './operations';
import './style.scss';

interface TilerInstance<T extends ViewId = ViewId> extends TilerProps<T> {
    // Extends the props with complete component interface
}

export const Tiler = React.forwardRef<HTMLDivElement, TilerInstance>(
    ({ value, onChange, renderTile, className = '' }, ref) => {
        const handleDragEnd = (event: DragEndEvent) => {
            const activeId = String(event.operation?.source?.id ?? '');
            const overId = String(event.operation?.target?.id ?? '');
            if (!activeId.startsWith('tile-') || !overId.startsWith('drop-')) return;

            const from = activeId.replace('tile-', '') as ViewId;
            const to = overId.replace('drop-', '') as ViewId;
            if (from === to) return;

            onChange(swapLeaves(value, from, to));
        };

        const handleClose = (id: ViewId) => {
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
                        <TilerNode
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
    }
);

Tiler.displayName = 'Tiler';
