'use client';

import React, { useRef } from 'react';
import { WindowNode, ViewId } from './types';
import { ResizeHandle } from './ResizeHandle';

interface TilerNodeProps<T extends ViewId = ViewId> {
    node: WindowNode;
    path: string;
    onClose: (id: T) => void;
    onResize: (path: string, splitPercentage: number) => void;
    renderTile: (id: T, canClose: boolean, onClose: (id: T) => void) => React.ReactElement;
}

export const TilerNode = <T extends ViewId = ViewId>({
    node,
    path,
    onClose,
    onResize,
    renderTile,
}: TilerNodeProps<T>) => {
    const splitRef = useRef<HTMLDivElement>(null);

    if (node.kind === 'leaf') {
        return (
            <div className="tile-container" key={path || node.id}>
                {renderTile(node.id as T, node.id !== 'Equations View', onClose)}
            </div>
        );
    }

    const isRow = node.direction === 'row';
    const firstBasis = `${node.splitPercentage}%`;
    const secondBasis = `${100 - node.splitPercentage}%`;

    return (
        <div
            ref={splitRef}
            className={`tile-split ${isRow ? 'tile-split-row' : 'tile-split-column'}`}
            key={path || 'root'}
        >
            <div className="tile-split-pane" style={{ flexBasis: firstBasis }}>
                <TilerNode<T>
                    node={node.first}
                    path={`${path}${path ? '.' : ''}first`}
                    onClose={onClose}
                    onResize={onResize}
                    renderTile={renderTile}
                />
            </div>
            <div
                className={`tile-divider ${
                    isRow ? 'tile-divider-vertical' : 'tile-divider-horizontal'
                }`}
            >
                <ResizeHandle
                    isVertical={isRow}
                    onResize={(splitPercentage) => onResize(path, splitPercentage)}
                    containerRef={splitRef}
                />
            </div>
            <div className="tile-split-pane" style={{ flexBasis: secondBasis }}>
                <TilerNode<T>
                    node={node.second}
                    path={`${path}${path ? '.' : ''}second`}
                    onClose={onClose}
                    onResize={onResize}
                    renderTile={renderTile}
                />
            </div>
        </div>
    );
};
