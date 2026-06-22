namespace AssetMenuTweaks {
    using System.Collections.Generic;

    using Colossal;
    using Colossal.IO.AssetDatabase;

    using Game.Input;
    using Game.Modding;
    using Game.Settings;
    using Game.UI;
    using Game.UI.Widgets;

    [FileLocation(nameof(AssetMenuTweaks))]
    [SettingsUIGroupOrder(GENERAL_GROUP_STR, KEYBINDINGS_GROUP_STR)]
    [SettingsUIShowGroupName(GENERAL_GROUP_STR, KEYBINDINGS_GROUP_STR)]
    [SettingsUIKeyboardAction(TOGGLE_PANEL_STR, ActionType.Button)]
    public class Setting : ModSetting {
        public const string GENERAL_GROUP_STR = "GeneralGroupStr";
        public const string KEYBINDINGS_GROUP_STR = "KeybindingsGroupStr";
        public const string TOGGLE_PANEL_STR = nameof(TogglePanel);

        public Setting(IMod mod) : base(mod) {

        }

        /// <summary>
        /// Tightens the asset menu layout (more columns/rows, smaller spacing).
        /// Auto-bound to the UI by <see cref="AssetMenuTweaksUISystem"/> — no
        /// dedicated binding required.
        /// </summary>
        [SettingsUISection(GENERAL_GROUP_STR)]
        public bool DenseUI { get; set; }

        [SettingsUISection(KEYBINDINGS_GROUP_STR)]
        [SettingsUIKeyboardBinding(BindingKeyboard.S, TOGGLE_PANEL_STR, ctrl: true, alt: true)]
        public ProxyBinding TogglePanel { get; set; }

        public override void SetDefaults() {
            DenseUI = false;
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
                { m_Setting.GetSettingsLocaleID(), "AssetMenuTweaks" },

                { m_Setting.GetOptionGroupLocaleID(Setting.GENERAL_GROUP_STR), "General" },
                { m_Setting.GetOptionGroupLocaleID(Setting.KEYBINDINGS_GROUP_STR), "Key Bindings" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.DenseUI)), "Dense UI" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.DenseUI)), "Tightens up the asset menu — more columns and rows with smaller spacing." },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TogglePanel)), "Toggle panel" },
            };
        }

        public void Unload() {

        }
    }
}
