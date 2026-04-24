'use client';

import React from 'react';
import { Button, Card } from 'react-bootstrap';
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

        return (
            <Card
                ref={drag.ref}
                className={`tile-panel h-100 shadow-sm ${
                    drag.isDragging ? 'tile-panel-dragging' : ''
                } ${showDropZones ? 'tile-panel-drop-mode' : ''}`}
            >
                <Card.Header className="d-flex justify-content-between align-items-center gap-2 tile-panel-header">
                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="tile-drag-handle"
                            ref={drag.handleRef}
                            title="Drag to rearrange windows"
                        >
                            <i className="bi bi-grid-3x3-gap-fill" />
                        </Button>
                        <span className="fw-semibold">{title}</span>
                    </div>
                    {canClose ? (
                        <Button
                            variant="outline-danger"
                            size="sm"
                            title="Close window"
                            onClick={() => onClose(id)}
                        >
                            <i className="bi bi-x-lg" />
                        </Button>
                    ) : null}
                </Card.Header>
                <Card.Body className="tile-panel-body">{children}</Card.Body>
                {showDropZones ? (
                    <div className="tile-drop-grid">
                        <TileDropZone id={id} position="top" iconClassName="bi bi-arrow-up" label="Top" />
                        <TileDropZone id={id} position="left" iconClassName="bi bi-arrow-left" label="Left" />
                        <TileDropZone
                            id={id}
                            position="center"
                            iconClassName="bi bi-arrow-left-right"
                            label="Swap"
                        />
                        <TileDropZone id={id} position="right" iconClassName="bi bi-arrow-right" label="Right" />
                        <TileDropZone id={id} position="bottom" iconClassName="bi bi-arrow-down" label="Bottom" />
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
    iconClassName: string;
    label: string;
}

function TileDropZone({ id, position, iconClassName, label }: TileDropZoneProps) {
    const drop = useDroppable({ id: getDropZoneId(id, position) });

    return (
        <div
            ref={drop.ref}
            className={`tile-drop-zone tile-drop-zone-${position} ${
                drop.isDropTarget ? 'tile-drop-zone-active' : ''
            }`}
        >
            <i className={iconClassName} />
            <span className="tile-drop-zone-label">{label}</span>
        </div>
    );
}
