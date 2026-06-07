import { DropPosition, ViewId } from './types';

const TILE_PREFIX = 'tile:';
const DROP_PREFIX = 'drop:';

const DROP_POSITIONS: DropPosition[] = ['top', 'right', 'bottom', 'left', 'center'];

export function getTileDragId(id: ViewId): string {
    return `${TILE_PREFIX}${encodeURIComponent(id)}`;
}

export function parseTileDragId(id: string): ViewId | null {
    if (!id.startsWith(TILE_PREFIX)) return null;
    return decodeId(id.slice(TILE_PREFIX.length));
}

export function getDropZoneId(id: ViewId, position: DropPosition): string {
    return `${DROP_PREFIX}${position}:${encodeURIComponent(id)}`;
}

export function parseDropZoneId(id: string): { position: DropPosition; targetId: ViewId } | null {
    if (!id.startsWith(DROP_PREFIX)) return null;

    const payload = id.slice(DROP_PREFIX.length);
    const separatorIndex = payload.indexOf(':');
    if (separatorIndex === -1) return null;

    const position = payload.slice(0, separatorIndex) as DropPosition;
    if (!DROP_POSITIONS.includes(position)) return null;

    const targetId = decodeId(payload.slice(separatorIndex + 1));
    if (targetId === null) return null;

    return { position, targetId };
}

function decodeId(value: string): ViewId | null {
    try {
        return decodeURIComponent(value);
    } catch {
        return null;
    }
}
