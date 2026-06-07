/**
 * Tiler: Binary-tree window tiling system using local UI primitives and @dnd-kit
 */

export { Tiler } from './Tiler';
export { TilePanel } from './TilePanel';
export { TilerNode } from './TilerNode';
export { ResizeHandle } from './ResizeHandle';

// Type exports
export type { DropPosition, WindowLeaf, WindowSplit, WindowNode, ViewId, ViewElements, TilerProps } from './types';

// Operation exports
export {
    containsView,
    addLeaf,
    removeLeaf,
    moveLeaf,
    swapLeaves,
    resizeByPath,
} from './operations';
