import type React from "react";
import type { Entity, NumericProperty } from "cs2/bindings";

/**
 * PROTOTYPE — TypeScript types for the base-game asset browser components.
 *
 * The game doesn't export prop types for these components, so these are
 * reconstructed from the decompiled bundle:
 *   - ItemGrid:  game-ui/game/components/item-grid/item-grid.tsx
 *   - AssetGrid: game-ui/game/components/asset-menu/asset-grid/asset-grid.tsx
 * (see NetworkTools.Mod/UI/tools/source.js)
 */

/**
 * One entry in the asset browser grid (the elements of ItemGrid's `items`).
 *
 * Mirrors the game's internal asset item type, emitted as `Asset$1` in
 * NetworkTools.Mod/UI/types/bindings.d.ts and re-exported as `toolbar$1.Asset`.
 * We mirror it rather than import it because the `toolbar$1` namespace name is a
 * bundler artifact that is not stable across game versions. Keep in sync with
 * `interface Asset$1` if the game type changes.
 */
export interface VanillaAssetItem {
    entity: Entity;
    name: string;
    priority: number;
    icon: string;
    dlc: string | null;
    theme: string | null;
    locked: boolean;
    uiTag: string;
    unique: boolean;
    placed: boolean;
    highlight: boolean;
    constructionCost: NumericProperty | null;
}

/**
 * Props of the base-game `ItemGrid` component.
 *
 * The three sizing props are optional because ItemGrid supplies destructuring
 * defaults when they are `undefined`:
 *   columnCount = 9, minRowCount = 2, maxRowCount = 2.
 */
export interface VanillaItemGridProps {
    className?: string;
    /** Minimum rows to render before paginating. Default 2. */
    minRowCount?: number;
    /** Maximum rows to render before paginating. Default 2. */
    maxRowCount?: number;
    /** Items per row. Default 9. */
    columnCount?: number;
    items: VanillaAssetItem[];
    selectedItem: Entity;
    onSelectItem: (entity: Entity) => void;
}

/**
 * Props of the base-game `AssetGrid` component.
 *
 * AssetGrid resolves `items` / `selectedItem` / `onSelectItem` internally from
 * bindings and spreads any extra props straight through to ItemGrid — and that
 * spread comes *after* its own values, so every ItemGrid prop (including the
 * data props) can be supplied here to override what AssetGrid would pass. Hence
 * all props are optional.
 */
export type VanillaAssetGridProps = Partial<VanillaItemGridProps>;

/** Function-component signature of the base-game `ItemGrid`. */
export type VanillaItemGrid = React.FC<VanillaItemGridProps>;

/** Function-component signature of the base-game `AssetGrid`. */
export type VanillaAssetGrid = React.FC<VanillaAssetGridProps>;
