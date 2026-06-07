/**
 * Binary tree operations for window layout management
 */

import { DropPosition, ViewId, WindowNode } from './types';

type LayoutRect = {
    left: number;
    top: number;
    right: number;
    bottom: number;
};

const ADJACENCY_EPSILON = 0.0001;

export function containsView(node: WindowNode | null, viewId: ViewId): boolean {
    if (!node) return false;
    if (node.kind === 'leaf') return node.id === viewId;
    return containsView(node.first, viewId) || containsView(node.second, viewId);
}

export function addLeaf(node: WindowNode | null, viewId: ViewId): WindowNode {
    if (!node) {
        return { kind: 'leaf', id: viewId };
    }
    if (containsView(node, viewId)) {
        return node;
    }
    return {
        kind: 'split',
        direction: 'row',
        first: node,
        second: { kind: 'leaf', id: viewId },
        splitPercentage: 66,
    };
}

export function removeLeaf(node: WindowNode | null, viewId: ViewId): WindowNode | null {
    if (!node) return null;
    if (node.kind === 'leaf') {
        return node.id === viewId ? null : node;
    }

    const first = removeLeaf(node.first, viewId);
    const second = removeLeaf(node.second, viewId);

    if (!first && !second) return null;
    if (!first) return second;
    if (!second) return first;

    return {
        ...node,
        first,
        second,
    };
}

export function swapLeaves(node: WindowNode | null, firstId: ViewId, secondId: ViewId): WindowNode | null {
    if (!node || firstId === secondId) return node;
    if (!containsView(node, firstId) || !containsView(node, secondId)) return node;

    return swapLeavesInternal(node, firstId, secondId);
}

function swapLeavesInternal(node: WindowNode, firstId: ViewId, secondId: ViewId): WindowNode {
    if (node.kind === 'leaf') {
        if (node.id === firstId) return { kind: 'leaf', id: secondId };
        if (node.id === secondId) return { kind: 'leaf', id: firstId };
        return node;
    }

    return {
        ...node,
        first: swapLeavesInternal(node.first, firstId, secondId),
        second: swapLeavesInternal(node.second, firstId, secondId),
    };
}

export function moveLeaf(node: WindowNode | null, movingId: ViewId, targetId: ViewId, position: DropPosition): WindowNode | null {
    if (!node || movingId === targetId) return node;
    if (!containsView(node, movingId) || !containsView(node, targetId)) return node;

    if (position === 'center') {
        return swapLeaves(node, movingId, targetId);
    }

    if (isLeafAdjacent(node, movingId, targetId, position)) {
        return node;
    }

    const pruned = removeLeaf(node, movingId);
    if (!pruned) return node;

    return insertLeafAdjacent(pruned, targetId, movingId, position);
}

export function resizeByPath(node: WindowNode | null, path: string, splitPercentage: number): WindowNode | null {
    if (!node) return null;
    if (path.length === 0) {
        if (node.kind !== 'split') return node;
        return {
            ...node,
            splitPercentage,
        };
    }
    if (node.kind !== 'split') return node;

    const [head, ...rest] = path.split('.');
    const nextPath = rest.join('.');
    if (head === 'first') {
        return {
            ...node,
            first: resizeByPath(node.first, nextPath, splitPercentage)!,
        };
    }
    return {
        ...node,
        second: resizeByPath(node.second, nextPath, splitPercentage)!,
    };
}

function isLeafAdjacent(
    node: WindowNode | null,
    movingId: ViewId,
    targetId: ViewId,
    position: Exclude<DropPosition, 'center'>
): boolean {
    const leafRects = collectLeafRects(node);
    const movingRect = leafRects.get(movingId);
    const targetRect = leafRects.get(targetId);

    if (!movingRect || !targetRect) return false;

    switch (position) {
        case 'top':
            return (
                areEdgesAligned(movingRect.bottom, targetRect.top) &&
                rangesOverlap(movingRect.left, movingRect.right, targetRect.left, targetRect.right)
            );
        case 'right':
            return (
                areEdgesAligned(movingRect.left, targetRect.right) &&
                rangesOverlap(movingRect.top, movingRect.bottom, targetRect.top, targetRect.bottom)
            );
        case 'bottom':
            return (
                areEdgesAligned(movingRect.top, targetRect.bottom) &&
                rangesOverlap(movingRect.left, movingRect.right, targetRect.left, targetRect.right)
            );
        case 'left':
            return (
                areEdgesAligned(movingRect.right, targetRect.left) &&
                rangesOverlap(movingRect.top, movingRect.bottom, targetRect.top, targetRect.bottom)
            );
    }
}

function collectLeafRects(
    node: WindowNode | null,
    rect: LayoutRect = { left: 0, top: 0, right: 1, bottom: 1 },
    leafRects = new Map<ViewId, LayoutRect>()
): Map<ViewId, LayoutRect> {
    if (!node) return leafRects;

    if (node.kind === 'leaf') {
        leafRects.set(node.id, rect);
        return leafRects;
    }

    const splitRatio = node.splitPercentage / 100;

    if (node.direction === 'row') {
        const x = rect.left + (rect.right - rect.left) * splitRatio;
        collectLeafRects(node.first, { ...rect, right: x }, leafRects);
        collectLeafRects(node.second, { ...rect, left: x }, leafRects);
        return leafRects;
    }

    const y = rect.top + (rect.bottom - rect.top) * splitRatio;
    collectLeafRects(node.first, { ...rect, bottom: y }, leafRects);
    collectLeafRects(node.second, { ...rect, top: y }, leafRects);
    return leafRects;
}

function insertLeafAdjacent(
    node: WindowNode,
    targetId: ViewId,
    movingId: ViewId,
    position: Exclude<DropPosition, 'center'>
): WindowNode {
    if (node.kind === 'leaf') {
        if (node.id !== targetId) {
            return node;
        }

        return buildSplitAroundTarget(node, movingId, position);
    }

    if (containsView(node.first, targetId)) {
        return {
            ...node,
            first: insertLeafAdjacent(node.first, targetId, movingId, position),
        };
    }

    return {
        ...node,
        second: insertLeafAdjacent(node.second, targetId, movingId, position),
    };
}

function buildSplitAroundTarget(
    targetNode: WindowNode,
    movingId: ViewId,
    position: Exclude<DropPosition, 'center'>
): WindowNode {
    const movingNode: WindowNode = { kind: 'leaf', id: movingId };

    switch (position) {
        case 'top':
            return {
                kind: 'split',
                direction: 'column',
                first: movingNode,
                second: targetNode,
                splitPercentage: 50,
            };
        case 'right':
            return {
                kind: 'split',
                direction: 'row',
                first: targetNode,
                second: movingNode,
                splitPercentage: 50,
            };
        case 'bottom':
            return {
                kind: 'split',
                direction: 'column',
                first: targetNode,
                second: movingNode,
                splitPercentage: 50,
            };
        case 'left':
            return {
                kind: 'split',
                direction: 'row',
                first: movingNode,
                second: targetNode,
                splitPercentage: 50,
            };
    }
}

function areEdgesAligned(first: number, second: number): boolean {
    return Math.abs(first - second) <= ADJACENCY_EPSILON;
}

function rangesOverlap(startA: number, endA: number, startB: number, endB: number): boolean {
    return Math.min(endA, endB) - Math.max(startA, startB) > ADJACENCY_EPSILON;
}
