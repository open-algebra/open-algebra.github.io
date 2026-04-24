'use client';

import React, { useRef } from 'react';

interface ResizeHandleProps {
    isVertical: boolean;
    onResize: (splitPercentage: number) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
    isVertical,
    onResize,
    containerRef,
}) => {
    const handleRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        const startPos = isVertical ? e.clientX : e.clientY;

        const container = containerRef.current;
        if (!container) return;

        const containerSize = isVertical
            ? container.getBoundingClientRect().width
            : container.getBoundingClientRect().height;

        // Get current split percentage from the first pane's flex basis
        const firstPane = container.querySelector('.tile-split-pane') as HTMLDivElement;
        if (!firstPane) return;

        const firstPaneSize = isVertical
            ? firstPane.getBoundingClientRect().width
            : firstPane.getBoundingClientRect().height;

        const startSplit = (firstPaneSize / containerSize) * 100;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const currentPos = isVertical ? moveEvent.clientX : moveEvent.clientY;
            const delta = currentPos - startPos;

            const pixelsPerPercent = containerSize / 100;
            const percentDelta = delta / pixelsPerPercent;
            const newSplit = Math.max(10, Math.min(90, startSplit + percentDelta));

            onResize(newSplit);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={handleRef}
            className={`resize-handle ${isVertical ? 'resize-handle-vertical' : 'resize-handle-horizontal'}`}
            onMouseDown={handleMouseDown}
            onTouchStart={(e) => {
                e.preventDefault();
                const startPos = isVertical ? e.touches[0].clientX : e.touches[0].clientY;

                const container = containerRef.current;
                if (!container) return;

                const containerSize = isVertical
                    ? container.getBoundingClientRect().width
                    : container.getBoundingClientRect().height;

                const firstPane = container.querySelector('.tile-split-pane') as HTMLDivElement;
                if (!firstPane) return;

                const firstPaneSize = isVertical
                    ? firstPane.getBoundingClientRect().width
                    : firstPane.getBoundingClientRect().height;

                const startSplit = (firstPaneSize / containerSize) * 100;

                const handleTouchMove = (moveEvent: TouchEvent) => {
                    const currentPos = isVertical ? moveEvent.touches[0].clientX : moveEvent.touches[0].clientY;
                    const delta = currentPos - startPos;

                    const pixelsPerPercent = containerSize / 100;
                    const percentDelta = delta / pixelsPerPercent;
                    const newSplit = Math.max(10, Math.min(90, startSplit + percentDelta));

                    onResize(newSplit);
                };

                const handleTouchEnd = () => {
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                };

                document.addEventListener('touchmove', handleTouchMove, { passive: false });
                document.addEventListener('touchend', handleTouchEnd);
            }}
            title={`Drag to resize ${isVertical ? 'columns' : 'rows'}`}
            role="slider"
            tabIndex={0}
            aria-label={`Resize ${isVertical ? 'columns' : 'rows'}`}
            style={{ zIndex: 10 }}
        />
    );
};
