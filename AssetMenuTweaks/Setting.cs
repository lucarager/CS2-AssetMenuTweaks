namespace AssetMenuTweaks {
    using System.Collections.Generic;

    using Colossal;
    using Colossal.IO.AssetDatabase;

    using Game.Input;
    using Game.Modding;
    using Game.Settings;
    using Game.UI;
    using Game.UI.Widgets;

    public enum DensityLevel {
        Low,
        Medium,
        High,
    }

    [FileLocation(nameof(AssetMenuTweaks))]
    [SettingsUIGroupOrder(GENERAL_GROUP_STR, KEYBINDINGS_GROUP_STR)]
    [SettingsUIShowGroupName(GENERAL_GROUP_STR, KEYBINDINGS_GROUP_STR)]
    public class Setting : ModSetting {
        public const string GENERAL_GROUP_STR = "GeneralGroupStr";
        public const string KEYBINDINGS_GROUP_STR = "KeybindingsGroupStr";

        public Setting(IMod mod) : base(mod) {

        }

        /// <summary>
        /// How tightly the asset grid is packed. 
        /// </summary>
        [SettingsUISection(GENERAL_GROUP_STR)]
        public DensityLevel Density { get; set; }

        /// <summary>
        /// Restyles and re-lays-out the asset category tabs (the redesigned tab UI).
        /// </summary>
        [SettingsUISection(GENERAL_GROUP_STR)]
        public bool RedesignedTabs { get; set; }

        /// <summary>
        /// Widens the asset panel so more asset columns are visible at once.
        /// </summary>
        [SettingsUISection(GENERAL_GROUP_STR)]
        public bool Widescreen { get; set; }

        /// <summary>
        /// Hides the badges (locked, DLC, not-enough-money, …) on asset grid buttons.
        /// </summary>
        [SettingsUISection(GENERAL_GROUP_STR)]
        public bool HideBadges { get; set; }

        public override void SetDefaults() {
            Density = DensityLevel.Low;
            RedesignedTabs = false;
            Widescreen = false;
            HideBadges = false;
        }

    }

    public class LocaleEn : IDictionarySource {
        private readonly Setting m_Setting;

        public LocaleEn(Setting setting) {
            m_Setting = setting;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts) {
            return new Dictionary<string, string>
            {
                { m_Setting.GetSettingsLocaleID(), "Asset Menu Tweaks" },

                { m_Setting.GetOptionGroupLocaleID(Setting.GENERAL_GROUP_STR), "General" },
                { m_Setting.GetOptionGroupLocaleID(Setting.KEYBINDINGS_GROUP_STR), "Key Bindings" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.Density)), "Grid Density" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.Density)), "How tightly the asset grid is packed. Low keeps the vanilla layout; higher densities use smaller buttons to fit more assets per row." },
                { m_Setting.GetEnumValueLocaleID(DensityLevel.Low), "Low" },
                { m_Setting.GetEnumValueLocaleID(DensityLevel.Medium), "Medium" },
                { m_Setting.GetEnumValueLocaleID(DensityLevel.High), "High" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.RedesignedTabs)), "Redesigned Tabs" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.RedesignedTabs)), "Restyles and re-lays-out the asset category tabs." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.Widescreen)), "Widescreen Mode" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.Widescreen)), "Widens the asset panel so more assets are visible at once." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.HideBadges)), "Hide Badges" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.HideBadges)), "Hides the badges (locked, DLC, not-enough-money, …) shown on asset grid buttons." },

                // UI Strings
                { "AMT.UI.Density.SectionTitle", "Density" },
                { "AMT.UI.Density.Low", "Low density" },
                { "AMT.UI.Density.Medium", "Medium density" },
                { "AMT.UI.Density.High", "High density" },

                { "AMT.UI.HideBadges.SectionTitle", "Hide Badges" },
                { "AMT.UI.HideBadges.Tooltip", "Hide Badges" },

                { "AMT.UI.RedesignedTabs.SectionTitle", "Redesigned Tabs" },
                { "AMT.UI.RedesignedTabs.Tooltip", "Toggle redesigned tabs" },

                { "AMT.UI.WidePanel.SectionTitle", "Wide Panel" },
                { "AMT.UI.WidePanel.Tooltip", "Toggle Wide Panel" },

                { "AMT.UI.ToggleButton.Hide", "Hide Panel" },
                { "AMT.UI.ToggleButton.Show", "Asset Menu Tweaks" },
            };
        }

        public void Unload() {

        }
    }
}
