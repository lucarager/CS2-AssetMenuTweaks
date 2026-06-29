import { bindValue } from "cs2/api";
import { TwoWayBinding } from "utils/bidirectionalBinding";

export enum Density {
    Low = 0,
    Medium = 1,
    High = 2,
}

export const GAME_BINDINGS = {
    DENSITY: new TwoWayBinding<Density>("DENSITY", Density.Low),
    REDESIGNED_TABS: new TwoWayBinding<boolean>("REDESIGNED_TABS", false),
    WIDESCREEN: new TwoWayBinding<boolean>("WIDESCREEN", false),
    HIDE_BADGES: new TwoWayBinding<boolean>("HIDE_BADGES", false),
};

// Read-only vanilla bindings we observe. `textScale` is the UI font-size option
// (game-ui/menu/data-binding/options-bindings.ts); the game sets the global
// `--fontScale` CSS var straight from it, so this value equals --fontScale and
// drives the sidebar-width calc() that widescreen has to work around.
export const VANILLA_BINDINGS = {
    FONT_SCALE: bindValue<number>("options", "textScale", 1),
};
