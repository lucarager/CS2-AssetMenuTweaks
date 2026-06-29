import React, { useEffect } from "react";
import { useValue } from "cs2/api";
import { GAME_BINDINGS } from "gameBindings";
import "./tweaks.module.scss";

const toggleBodyClass = (className: string, on: boolean) => {
    document.body.classList.toggle(className, on);
    return () => document.body.classList.remove(className);
};

export const SettingsController: React.FC = () => {
    const redesignedTabs = useValue(GAME_BINDINGS.REDESIGNED_TABS.binding);
    const widescreen = useValue(GAME_BINDINGS.WIDESCREEN.binding);
    const hideBadges = useValue(GAME_BINDINGS.HIDE_BADGES.binding);
    const density = useValue(GAME_BINDINGS.DENSITY.binding);

    useEffect(() => toggleBodyClass("amt__redesignedTabs", redesignedTabs), [redesignedTabs]);
    useEffect(() => toggleBodyClass("amt__widescreen", widescreen), [widescreen]);
    useEffect(() => toggleBodyClass("amt__hideBadges", hideBadges), [hideBadges]);
    useEffect(() => {
        document.body.classList.add(`amt__density_${density}`);
        return () => document.body.classList.remove(`amt__density_${density}`);
    }, [density]);

    return null;
};
