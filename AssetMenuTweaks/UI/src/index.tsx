import { SettingsController } from "components/settingsController";
import { ModRegistrar } from "cs2/modding";
import { initialize } from "vanilla/Components";
import { AssetMenuWrapper } from "components/assetMenuWrapper";
import { AssetGridLayout } from "components/assetGridLayout";

const register: ModRegistrar = (moduleRegistry) => {
    initialize(moduleRegistry);

    moduleRegistry.extend(
        "game-ui/game/components/asset-menu/asset-grid/asset-grid.tsx",
        "AssetGrid",
        AssetGridLayout,
    );

    moduleRegistry.extend(
        "game-ui/game/components/asset-menu/asset-menu.tsx",
        "AssetMenu",
        AssetMenuWrapper,
    );

    moduleRegistry.append("Game", SettingsController);
};

export default register;
