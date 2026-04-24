/**
 * Core types for the binary-tree tiling window manager
 */

export type ViewId = string;

export type WindowLeaf = {
    kind: 'leaf';
    id: ViewId;
};

export type WindowSplit = {
    kind: 'split';
    direction: 'row' | 'column';
    first: WindowNode;
    second: WindowNode;
    splitPercentage: number;
};

export type WindowNode = WindowLeaf | WindowSplit;

export type ViewElements<T extends ViewId = ViewId> = Record<T, React.ReactElement>;

export type TilerProps<T extends ViewId = ViewId> = {
    value: WindowNode | null;
    onChange: (layout: WindowNode | null) => void;
    renderTile: (id: T, canClose: boolean, onClose: (id: T) => void) => React.ReactElement;
    className?: string;
};
