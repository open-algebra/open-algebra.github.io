'use client';

import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { useDraggable, useDroppable } from '@dnd-kit/react';
import { ViewId } from './types';

interface TilePanelProps {
    id: ViewId;
    canClose: boolean;
    title: string;
    children: React.ReactElement;
    onClose: (id: ViewId) => void;
}

export const TilePanel = React.forwardRef<HTMLDivElement, TilePanelProps>(
    ({ id, canClose, title, children, onClose }, _forwardRef) => {
        const drag = useDraggable({ id: `tile-${id}` });
        const drop = useDroppable({ id: `drop-${id}` });

        return (
            <Card
                ref={(node) => {
                    drag.ref(node);
                    drop.ref(node);
                }}
                className={`tile-panel h-100 shadow-sm ${
                    drop.isDropTarget ? 'tile-panel-over' : ''
                } ${drag.isDragging ? 'tile-panel-dragging' : ''}`}
            >
                <Card.Header className="d-flex justify-content-between align-items-center gap-2 tile-panel-header">
                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="tile-drag-handle"
                            ref={drag.handleRef}
                            title="Drag to swap windows"
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
            </Card>
        );
    }
);

TilePanel.displayName = 'TilePanel';
