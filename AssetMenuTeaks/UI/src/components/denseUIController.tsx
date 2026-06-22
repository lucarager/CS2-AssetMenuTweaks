import React, { useEffect } from "react";
import { useValue } from "cs2/api";
import { GAME_BINDINGS } from "gameBindings";

const DENSE_UI_CLASS = "amt__denseUI";

/**
 * Headless controller: mirrors the DenseUI setting onto a <body> class so any
 * SCSS can gate "dense" rules behind `body.amt__denseUI` (no need to thread the
 * setting into each component). Mounted once via moduleRegistry.append in
 * index.tsx; renders nothing.
 */
export const DenseUIController: React.FC = () => {
    const dense = useValue(GAME_BINDINGS.SETTINGS).DenseUI;

    useEffect(() => {
        document.body.classList.toggle(DENSE_UI_CLASS, dense);
        return () => document.body.classList.remove(DENSE_UI_CLASS);
    }, [dense]);

    return null;
};
