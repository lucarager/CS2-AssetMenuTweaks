namespace AssetMenuTweaks {
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;

    using Colossal.UI.Binding;

    using LucaModsCommon.Systems;

    /// <summary>
    /// Bridges the mod's <see cref="Setting"/> to the UI. Instead of declaring a
    /// binding per setting, it reflects over every UI-relevant property on
    /// <see cref="Setting"/>, serializes them into a single <c>SETTINGS</c> value
    /// binding, and exposes typed <c>SET_SETTING_*</c> triggers that resolve the
    /// target property by name. Adding a new setting only means adding a property
    /// to <see cref="Setting"/> (and a field to the UI's ModSettings type).
    /// </summary>
    public partial class AssetMenuTweaksUISystem : CommonUISystemBase {
        protected override string ModId => Mod.Instance.Id;

        private const string SETTINGS_KEY = "SETTINGS";

        private Setting m_Setting;
        private ValueBinding<Dictionary<string, object>> m_SettingsBinding;

        protected override void OnCreate() {
            base.OnCreate();

            m_Setting = (Setting)Mod.Instance.Settings;

            // One binding carrying ALL settings, serialized by reflection.
            m_SettingsBinding = new ValueBinding<Dictionary<string, object>>(
                ModId, $"BINDING:{SETTINGS_KEY}", BuildSnapshot(), new SettingsMapWriter());
            AddBinding(m_SettingsBinding);

            // Typed setters — generic across every setting of that type. The UI
            // calls the one matching the value's type with (settingName, value).
            CreateTrigger<string, bool>("SET_SETTING_BOOL", (name, value) => SetSetting(name, value));
            CreateTrigger<string, int>("SET_SETTING_INT", (name, value) => SetSetting(name, value));
            CreateTrigger<string, float>("SET_SETTING_FLOAT", (name, value) => SetSetting(name, value));
            CreateTrigger<string, string>("SET_SETTING_STRING", (name, value) => SetSetting(name, value));

            // Keep the UI in sync when settings change from the game's Options screen.
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

        // Param is the base game's Game.Settings.Setting (the delegate's type),
        // not our same-named Setting class.
        private void OnSettingsApplied(Game.Settings.Setting setting) => RefreshSnapshot();

        /// <summary>Sets a setting by name (value boxed from a typed trigger), persists, and re-publishes.</summary>
        private void SetSetting(string name, object value) {
            var property = ResolveSettingProperty(name);
            if (property == null) {
                m_Log.Warn($"SetSetting: unknown or unsupported setting '{name}'");
                return;
            }

            try {
                var converted = property.PropertyType.IsEnum
                    ? Enum.ToObject(property.PropertyType, Convert.ToInt32(value))
                    : Convert.ChangeType(value, property.PropertyType);

                property.SetValue(m_Setting, converted);

                RefreshSnapshot();      // immediate UI feedback
                m_Setting.ApplyAndSave(); // persist (also re-fires onSettingsApplied)
            } catch (Exception ex) {
                m_Log.Error($"SetSetting('{name}') failed: {ex}");
            }
        }

        private void RefreshSnapshot() => m_SettingsBinding.Update(BuildSnapshot());

        private Dictionary<string, object> BuildSnapshot() {
            var snapshot = new Dictionary<string, object>();
            foreach (var property in GetUiSettingProperties()) {
                snapshot[property.Name] = property.GetValue(m_Setting);
            }

            return snapshot;
        }

        private PropertyInfo ResolveSettingProperty(string name) =>
            GetUiSettingProperties().FirstOrDefault(p => p.Name == name);

        /// <summary>
        /// Public read/write scalar properties declared directly on <see cref="Setting"/>.
        /// Excludes keybindings (<c>ProxyBinding</c>) and anything we can't round-trip.
        /// </summary>
        private static IEnumerable<PropertyInfo> GetUiSettingProperties() =>
            typeof(Setting)
                .GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly)
                .Where(p => p.CanRead && p.CanWrite && IsSupported(p.PropertyType));

        private static bool IsSupported(Type t) =>
            t == typeof(bool) || t == typeof(int) || t == typeof(uint) ||
            t == typeof(float) || t == typeof(double) || t == typeof(string) || t.IsEnum;

        /// <summary>Writes a <c>{ name: value }</c> map of scalars as a plain JSON object for the UI.</summary>
        private sealed class SettingsMapWriter : IWriter<Dictionary<string, object>> {
            public void Write(IJsonWriter writer, Dictionary<string, object> value) {
                writer.MapBegin((uint)value.Count);
                foreach (var pair in value) {
                    writer.PropertyName(pair.Key);
                    WriteScalar(writer, pair.Value);
                }

                writer.MapEnd();
            }

            private static void WriteScalar(IJsonWriter writer, object obj) {
                switch (obj) {
                    case null: writer.WriteNull(); break;
                    case bool b: writer.Write(b); break;
                    case int i: writer.Write(i); break;
                    case uint u: writer.Write(u); break;
                    case float f: writer.Write(f); break;
                    case double d: writer.Write(d); break;
                    case string s: writer.Write(s); break;
                    case Enum e: writer.Write(Convert.ToInt32(e)); break;
                    default: writer.Write(obj.ToString()); break;
                }
            }
        }
    }
}
