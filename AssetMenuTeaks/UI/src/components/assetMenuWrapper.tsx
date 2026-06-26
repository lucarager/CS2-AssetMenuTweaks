import React from "react";
import { ModuleRegistryExtend } from "cs2/modding";
import { useValue } from "cs2/api";
import styles from "./assetMenuWrapper.module.scss";
import {
    VanillaAssetMenu,
    VanillaAssetMenuProps,
} from "./vanillaAssetMenu.types";
import { GAME_BINDINGS, Density } from "gameBindings";
import { c } from "utils/classes";
import { VC, VF, VT } from "vanilla/Components";
import { useLocalization } from "cs2/l10n";

export const AssetMenuWrapper: ModuleRegistryExtend = (Component) => {
    const VanillaAssetMenuComponent = Component as VanillaAssetMenu;

    const AssetMenu = (props: VanillaAssetMenuProps) => {
        const [expanded, setExpanded] = React.useState(false);
        const density = useValue(GAME_BINDINGS.DENSITY.binding);
        const redesignedTabs = useValue(GAME_BINDINGS.REDESIGNED_TABS.binding);
        const widescreen = useValue(GAME_BINDINGS.WIDESCREEN.binding);
        const hideBadges = useValue(GAME_BINDINGS.HIDE_BADGES.binding);

        const { translate } = useLocalization();

        const densityLevels: {
            level: Density;
            tooltip: string;
            icon: string;
        }[] = [
            {
                level: Density.Low,
                tooltip: translate("AMT.UI.Density.Low", "Low density")!,
                icon: "coui://amt/dense_0.svg",
            },
            {
                level: Density.Medium,
                tooltip: translate("AMT.UI.Density.Medium", "Medium density")!,
                icon: "coui://amt/dense_1.svg",
            },
            {
                level: Density.High,
                tooltip: translate("AMT.UI.Density.High", "High density")!,
                icon: "coui://amt/dense_2.svg",
            },
        ];

        return (
            <>
                <div className={c(styles.amt__container)}>
                    {expanded && (
                        <div
                            className={c(
                                styles.amt__panel,
                                VT.toolOptionsPanel.toolOptionsPanel,
                            )}
                        >
                            <VC.Section
                                title={translate(
                                    "AMT.UI.Density.SectionTitle",
                                    "Density",
                                )}
                            >
                                {densityLevels.map(
                                    ({ level, tooltip, icon }) => (
                                        <VC.ToolButton
                                            key={level}
                                            className={c(VT.toolButton.button)}
                                            src={icon}
                                            onSelect={() =>
                                                GAME_BINDINGS.DENSITY.set(level)
                                            }
                                            selected={density === level}
                                            multiSelect={true}
                                            disabled={false}
                                            focusKey={VF.FOCUS_DISABLED}
                                            tooltip={tooltip}
                                        />
                                    ),
                                )}
                            </VC.Section>
                            <VC.Section
                                title={translate(
                                    "AMT.UI.HideBadges.SectionTitle",
                                    "Hide Badges",
                                )}
                            >
                                <VC.ToolButton
                                    className={c(VT.toolButton.button)}
                                    multiSelect={true}
                                    disabled={false}
                                    focusKey={VF.FOCUS_DISABLED}
                                    selected={hideBadges}
                                    src="coui://amt/hide_badges.svg"
                                    onSelect={() =>
                                        GAME_BINDINGS.HIDE_BADGES.set(
                                            !hideBadges,
                                        )
                                    }
                                    tooltip={translate(
                                        "AMT.UI.HideBadges.Tooltip",
                                        "Hide Badges",
                                    )}
                                />
                            </VC.Section>
                            <VC.Section
                                title={translate(
                                    "AMT.UI.RedesignedTabs.SectionTitle",
                                    "Redesigned Tabs",
                                )}
                            >
                                <VC.ToolButton
                                    className={c(VT.toolButton.button)}
                                    multiSelect={true}
                                    disabled={false}
                                    focusKey={VF.FOCUS_DISABLED}
                                    selected={redesignedTabs}
                                    src="coui://amt/tabs.svg"
                                    onSelect={() =>
                                        GAME_BINDINGS.REDESIGNED_TABS.set(
                                            !redesignedTabs,
                                        )
                                    }
                                    tooltip={translate(
                                        "AMT.UI.RedesignedTabs.Tooltip",
                                        "Toggle redesigned tabs",
                                    )}
                                />
                            </VC.Section>
                            <VC.Section
                                title={translate(
                                    "AMT.UI.WidePanel.SectionTitle",
                                    "Wide Panel",
                                )}
                            >
                                <VC.ToolButton
                                    className={c(VT.toolButton.button)}
                                    multiSelect={true}
                                    disabled={false}
                                    focusKey={VF.FOCUS_DISABLED}
                                    selected={widescreen}
                                    src="coui://amt/expand.svg"
                                    onSelect={() =>
                                        GAME_BINDINGS.WIDESCREEN.set(
                                            !widescreen,
                                        )
                                    }
                                    tooltip={translate(
                                        "AMT.UI.WidePanel.Tooltip",
                                        "Toggle Wide Panel",
                                    )}
                                />
                            </VC.Section>
                        </div>
                    )}
                    <VC.ToolButton
                        className={c(
                            VT.toolButton.button,
                            styles.amt__toggleButton,
                        )}
                        src="coui://amt/settings.svg"
                        onSelect={() => setExpanded((v) => !v)}
                        selected={expanded}
                        multiSelect={true}
                        disabled={false}
                        focusKey={VF.FOCUS_DISABLED}
                        tooltip={
                            expanded
                                ? translate(
                                      "AMT.UI.ToggleButton.Hide",
                                      "Hide Panel",
                                  )
                                : translate(
                                      "AMT.UI.ToggleButton.Show",
                                      "Asset Menu Tweaks",
                                  )
                        }
                    />
                </div>
                <VanillaAssetMenuComponent {...props} />
            </>
        );
    };

    return AssetMenu;
};
