import type React from "react";
import type { FocusKey } from "cs2/ui";

/**
 * PROTOTYPE — TypeScript types for the base-game asset menu panel.
 *
 * Reconstructed from the decompiled bundle (the game exports no prop types):
 *   AssetMenu: game-ui/game/components/asset-menu/asset-menu.tsx  (`Dte`)
 * (see NetworkTools.Mod/UI/tools/source.js)
 *
 * AssetMenu is the top-level panel that hosts the asset detail panel and the
 * asset panel — the latter wraps the AssetGrid/ItemGrid. Overriding it lets us
 * resize/restyle the whole panel (e.g. widen it to make room for extra grid
 * columns added via the AssetGrid override).
 */
export interface VanillaAssetMenuProps {
    /** Focus key forwarded to the panel root. */
    focusKey?: FocusKey;
    /** Applied to the panel root element. */
    className?: string;
    /** Invoked when the panel requests to close (Close action / default tool). */
    onClose: () => void;
}

/** Function-component signature of the base-game `AssetMenu`. */
export type VanillaAssetMenu = React.FC<VanillaAssetMenuProps>;
