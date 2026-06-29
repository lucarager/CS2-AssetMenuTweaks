namespace AssetMenuTweaks {
    using LucaModsCommon.Extensions;
    using LucaModsCommon.Systems;

    public partial class AssetMenuTweaksUISystem : CommonUISystemBase {
        protected override string ModId => Mod.Instance.Id;

        private Setting m_Setting;
        private ValueBindingHelper<int> m_Density;
        private ValueBindingHelper<bool> m_RedesignedTabs;
        private ValueBindingHelper<bool> m_Widescreen;
        private ValueBindingHelper<bool> m_HideBadges;

        protected override void OnCreate() {
            base.OnCreate();

            m_Setting = (Setting)Mod.Instance.Settings;

            // Enum flag bound as int (the wire format) — same pattern NetworkTools
            // uses for its SnapOption/ViewOption flags: write int, cast back on set.
            m_Density = CreateBinding("DENSITY", (int)m_Setting.Density,
                v => { m_Setting.Density = (DensityLevel)v; m_Setting.ApplyAndSave(); });
            m_RedesignedTabs = CreateBinding("REDESIGNED_TABS", m_Setting.RedesignedTabs,
                v => { m_Setting.RedesignedTabs = v; m_Setting.ApplyAndSave(); });
            m_Widescreen = CreateBinding("WIDESCREEN", m_Setting.Widescreen,
                v => { m_Setting.Widescreen = v; m_Setting.ApplyAndSave(); });
            m_HideBadges = CreateBinding("HIDE_BADGES", m_Setting.HideBadges,
                v => { m_Setting.HideBadges = v; m_Setting.ApplyAndSave(); });

            m_Setting.onSettingsApplied += OnSettingsApplied;
        }

        protected override void OnDestroy() {
            if (m_Setting != null) {
                m_Setting.onSettingsApplied -= OnSettingsApplied;
            }

            base.OnDestroy();
        }

        protected override void OnUpdate() {

        }

        // Re-sync bindings when settings change from the game's Options screen.
        // Param is the base game's Game.Settings.Setting (the delegate's type),
        // not our same-named Setting class.
        private void OnSettingsApplied(Game.Settings.Setting setting) {
            m_Density.Value = (int)m_Setting.Density;
            m_RedesignedTabs.Value = m_Setting.RedesignedTabs;
            m_Widescreen.Value = m_Setting.Widescreen;
            m_HideBadges.Value = m_Setting.HideBadges;
        }
    }
}
