import React from "react";
import { ModuleRegistry, ModuleRegistryExtend } from "cs2/modding";
import { c } from "utils/classes";
import styles from "./prototypeAssetGrid.module.scss";
import { VanillaAssetGrid, VanillaAssetGridProps } from "./vanillaAssetGrid.types";

/**
 * PROTOTYPE — hijack the base-game asset browser grid to change how many
 * columns / rows it shows.
 *
 * Mechanism:
 *  - The shared `ItemGrid` (game-ui/game/components/item-grid/item-grid.tsx)
 *    declares its sizing as destructuring *defaults*:
 *        columnCount = 9, minRowCount = 2, maxRowCount = 2
 *    Defaults only apply when the prop is `undefined`.
 *  - `AssetGrid` (asset-menu/asset-grid/asset-grid.tsx) spreads its own props
 *    straight into ItemGrid, so anything we pass to AssetGrid flows down and
 *    overrides those defaults.
 *
 * So instead of replacing ItemGrid globally (which would also hit the upgrades
 * menu and every other grid), we extend the AssetGrid parent and inject the
 * counts there.
 *
 * NOTE: this still affects EVERY asset menu (roads, buildings, props, …) since
 * they all render the same AssetGrid. That's fine for experimenting — scope it
 * down before shipping (e.g. only when a specific menu/tool is active).
 */

// ─── Tweak me ───────────────────────────────────────────────────────────────
const COLUMN_COUNT = 14;
const MIN_ROW_COUNT = 6;
const MAX_ROW_COUNT = 6;
// ─────────────────────────────────────────────────────────────────────────────

const AssetGridPrototype: ModuleRegistryExtend = (Component) => {
    // The registry hands us the raw component as `ComponentType<any>`; re-type
    // it with the reconstructed AssetGrid props for type-safe overrides.
    const VanillaAssetGridComponent = Component as VanillaAssetGrid;

    const PrototypeAssetGrid = (props: VanillaAssetGridProps) => (
        <VanillaAssetGridComponent
            {...props}
            // Tag the grid root (ItemGrid forwards `className` onto its root
            // div) so the SCSS can scope to just the grids we override.
            className={c(props.className ?? "", styles.prototypeGrid)}
            columnCount={COLUMN_COUNT}
            minRowCount={MIN_ROW_COUNT}
            maxRowCount={MAX_ROW_COUNT}
        />
    );

    return PrototypeAssetGrid;
};

export const registerAssetGridPrototype = (moduleRegistry: ModuleRegistry) => {
    moduleRegistry.extend(
        "game-ui/game/components/asset-menu/asset-grid/asset-grid.tsx",
        "AssetGrid",
        AssetGridPrototype,
    );
};
