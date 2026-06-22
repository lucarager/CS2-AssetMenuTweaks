import { registerAssetGridPrototype } from "components/prototypeAssetGrid";
import { registerAssetMenuPrototype } from "components/prototypeAssetMenu";
import { DenseUIController } from "components/denseUIController";
import { ModRegistrar } from "cs2/modding";
import { initialize } from "vanilla/Components";

const register: ModRegistrar = (moduleRegistry) => {
    // Resolve the shared base set of vanilla components/themes/focus.
    initialize(moduleRegistry);

    // PROTOTYPE: override the base-game asset browser grid column/row counts.
    // Comment this out to revert to vanilla sizing.
    registerAssetGridPrototype(moduleRegistry);

    // PROTOTYPE: wrap the asset menu panel so we can resize/restyle it (e.g.
    // widen it to fit the extra grid columns above).
    registerAssetMenuPrototype(moduleRegistry);

    // Mirrors the DenseUI setting onto a <body> class for CSS to key off.
    moduleRegistry.append("Game", DenseUIController);
};

export default register;
