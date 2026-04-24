/**
 * Binary tree operations for window layout management
 */

import { ViewId, WindowNode } from './types';

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
    if (!node) return null;

    if (node.kind === 'leaf') {
        if (node.id === firstId) return { kind: 'leaf', id: secondId };
        if (node.id === secondId) return { kind: 'leaf', id: firstId };
        return node;
    }

    return {
        ...node,
        first: swapLeaves(node.first, firstId, secondId)!,
        second: swapLeaves(node.second, firstId, secondId)!,
    };
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
