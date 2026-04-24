/**
 * Tiler: Binary-tree window tiling system using React Bootstrap and @dnd-kit
 */

export { Tiler } from './Tiler';
export { TilePanel } from './TilePanel';
export { TilerNode } from './TilerNode';

// Type exports
export type { WindowLeaf, WindowSplit, WindowNode, ViewId, ViewElements, TilerProps } from './types';

// Operation exports
export {
    containsView,
    addLeaf,
    removeLeaf,
    swapLeaves,
    resizeByPath,
} from './operations';
