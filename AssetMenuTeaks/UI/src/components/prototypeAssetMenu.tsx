import React from "react";
import { ModuleRegistry, ModuleRegistryExtend } from "cs2/modding";
import { c } from "utils/classes";
import styles from "./prototypeAssetMenu.module.scss";
import { VanillaAssetMenu, VanillaAssetMenuProps } from "./vanillaAssetMenu.types";
import { Button } from "cs2/ui";

/**
 * PROTOTYPE — wrap the base-game asset menu panel
 * (game-ui/game/components/asset-menu/asset-menu.tsx, export `AssetMenu`).
 *
 * AssetMenu is the parent panel that contains the asset detail panel and the
 * asset panel — and the asset panel renders the AssetGrid we override in
 * prototypeAssetGrid.tsx. Wrapping it here lets us restyle/resize the whole
 * panel, e.g. widen it so the extra grid columns actually fit.
 *
 * AssetMenu forwards its `className` onto the panel root, so we tag it and scope
 * our SCSS to `.prototypeMenu`.
 *
 * NOTE: like the AssetGrid override, this affects EVERY asset menu (roads,
 * buildings, props, …). Fine for experimenting; scope it down before shipping.
 */

const AssetMenuPrototype: ModuleRegistryExtend = (Component) => {
    // The registry hands us the raw component as `ComponentType<any>`; re-type
    // it with the reconstructed AssetMenu props for type-safe overrides.
    const VanillaAssetMenuComponent = Component as VanillaAssetMenu;

    const PrototypeAssetMenu = (props: VanillaAssetMenuProps) => (
       <>
            <div className={styles.amt__toggleContainer}>
                <Button selected={false} src="coui://uil/Standard/ArrowLeft.svg" onSelect={() => {}} tooltipLabel="Toggle dense UI" />
                <Button selected={false} src="coui://uil/Standard/ArrowRight.svg" onSelect={() => {}} tooltipLabel="Toggle vertical tabs" />
                <Button selected={false} src="coui://uil/Standard/ArrowUp.svg" onSelect={() => {}} tooltipLabel="Toggle expansion mode" />
            </div>
            <VanillaAssetMenuComponent
                {...props}
                // Tag the panel root so the SCSS can scope to just the menus we wrap.
                className={c(props.className ?? "", styles.prototypeMenu)}
            />
       </>
    );

    return PrototypeAssetMenu;
};

export const registerAssetMenuPrototype = (moduleRegistry: ModuleRegistry) => {
    moduleRegistry.extend(
        "game-ui/game/components/asset-menu/asset-menu.tsx",
        "AssetMenu",
        AssetMenuPrototype,
    );
};
