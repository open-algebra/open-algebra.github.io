'use client';
/* eslint-disable react-hooks/refs */

import React from 'react';
import { Grip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useDragOperation, useDraggable, useDroppable } from '@dnd-kit/react';
import { DropPosition, ViewId } from './types';
import { getDropZoneId, getTileDragId, parseTileDragId } from './dnd';

interface TilePanelProps {
    id: ViewId;
    canClose: boolean;
    title: string;
    children: React.ReactElement;
    onClose: (id: ViewId) => void;
}

export const TilePanel = React.forwardRef<HTMLDivElement, TilePanelProps>(
    ({ id, canClose, title, children, onClose }, _forwardRef) => {
        const drag = useDraggable({ id: getTileDragId(id) });
        const operation = useDragOperation();
        const activeTileId = parseTileDragId(String(operation.source?.id ?? ''));
        const showDropZones = activeTileId !== null && activeTileId !== id;
        const dragRef = drag.ref;
        const dragHandleRef = drag.handleRef;
        const isDragging = drag.isDragging;

        return (
            <Card
                ref={dragRef}
                className={`tile-panel flex h-full flex-col shadow-sm ${
                    isDragging ? 'tile-panel-dragging' : ''
                } ${showDropZones ? 'tile-panel-drop-mode' : ''}`}
            >
                <CardHeader className="tile-panel-header flex h-8 shrink-0 flex-row items-center justify-between gap-2 space-y-0 px-1.5 py-0">
                    <div className="flex h-full min-w-0 items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="tile-drag-handle size-6 border-0 bg-transparent text-muted-foreground shadow-none outline-none ring-0 hover:bg-black/5 focus-visible:ring-0"
                            ref={dragHandleRef}
                            title="Drag to rearrange windows"
                            aria-label="Drag to rearrange windows"
                        >
                            <Grip className="size-3.5" />
                        </Button>
                        <span className="truncate text-xs font-semibold leading-none tracking-tight">{title}</span>
                    </div>
                    {canClose ? (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            title="Close window"
                            aria-label="Close window"
                            onClick={() => onClose(id)}
                        >
                            <X className="size-3.5" />
                        </Button>
                    ) : null}
                </CardHeader>
                <CardContent className="tile-panel-body flex min-h-0 flex-1 flex-col p-0">{children}</CardContent>
                {showDropZones ? (
                    <div className="tile-drop-grid">
                        <TileDropZone id={id} position="top" label="Top" />
                        <TileDropZone id={id} position="left" label="Left" />
                        <TileDropZone
                            id={id}
                            position="center"
                            label="Swap"
                        />
                        <TileDropZone id={id} position="right" label="Right" />
                        <TileDropZone id={id} position="bottom" label="Bottom" />
                    </div>
                ) : null}
            </Card>
        );
    }
);

TilePanel.displayName = 'TilePanel';

interface TileDropZoneProps {
    id: ViewId;
    position: DropPosition;
    label: string;
}

function TileDropZone({ id, position, label }: TileDropZoneProps) {
    const drop = useDroppable({ id: getDropZoneId(id, position) });
    const dropRef = drop.ref;
    const isDropTarget = drop.isDropTarget;

    return (
        <div
            ref={dropRef}
            className={`tile-drop-zone tile-drop-zone-${position} ${
                isDropTarget ? 'tile-drop-zone-active' : ''
            }`}
        >
            <span className="tile-drop-zone-label">{label}</span>
        </div>
    );
}
