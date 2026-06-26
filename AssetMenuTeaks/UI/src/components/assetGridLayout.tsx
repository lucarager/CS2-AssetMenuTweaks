import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModuleRegistryExtend } from "cs2/modding";
import { useValue } from "cs2/api";
import { useRem } from "cs2/utils";
import { VanillaAssetGrid, VanillaAssetGridProps } from "./vanillaAssetGrid.types";
import { GAME_BINDINGS, VANILLA_BINDINGS, Density } from "gameBindings";
import { DENSITY_ITEM_REM, computeGrid } from "./assetMenuLayout";

export const AssetGridLayout: ModuleRegistryExtend = (Component) => {
    const VanillaAssetGridComponent = Component as VanillaAssetGrid;

    const AssetGrid = (props: VanillaAssetGridProps) => {
        const density = useValue(GAME_BINDINGS.DENSITY.binding);
        const widescreen = useValue(GAME_BINDINGS.WIDESCREEN.binding);
        const fontScale = useValue(VANILLA_BINDINGS.FONT_SCALE);
        const rem = useRem();
        const [viewportPx, setViewportPx] = useState(() => window.innerWidth);

        // Low + no widescreen == vanilla: no overrides at all.
        const enabled = density !== Density.Low || widescreen;

        // Widescreen width derives from the viewport, so track its width.
        useEffect(() => {
            if (!widescreen) return;
            const onResize = () => setViewportPx(window.innerWidth);
            onResize();
            window.addEventListener("resize", onResize);
            return () => window.removeEventListener("resize", onResize);
        }, [widescreen]);

        const itemRem = DENSITY_ITEM_REM[density] ?? DENSITY_ITEM_REM[Density.Low];

        const dims = useMemo(
            () => computeGrid({ itemRem, widescreen, viewportPx, fontScale, rem }),
            [itemRem, widescreen, viewportPx, fontScale, rem],
        );

        const propOverrides: VanillaAssetGridProps = enabled
            ? { columnCount: dims.columns, minRowCount: dims.rows, maxRowCount: dims.rows }
            : {};

        // The vanilla ItemGrid keeps its current-page index in internal state and
        // only re-derives it when the *items array reference* changes. Force re-render via key.
        const gridKey = enabled ? `${dims.columns}x${dims.rows}` : "vanilla";

        return (
            <VanillaAssetGridComponent key={gridKey} {...props} {...propOverrides} />
        );
    };

    return AssetGrid;
};
