import { bindValue, trigger } from "cs2/api";
import mod from "mod.json";

const GROUP = mod.id;

/**
 * Live snapshot of the mod's settings, auto-serialized from C# by
 * AssetMenuTweaksUISystem. Add a field here whenever you add a property to
 * Setting.cs — no new binding is needed.
 */
export interface ModSettings {
    DenseUI: boolean;
}

const SETTINGS_DEFAULTS: ModSettings = {
    DenseUI: false,
};

export const GAME_BINDINGS = {
    /** All mod settings in a single binding (see AssetMenuTweaksUISystem). */
    SETTINGS: bindValue<ModSettings>(GROUP, "BINDING:SETTINGS", SETTINGS_DEFAULTS),
};

/** Keys of ModSettings whose value has type V — keeps the setters type-safe. */
type SettingKeyOf<V> = {
    [K in keyof ModSettings]: ModSettings[K] extends V ? K : never;
}[keyof ModSettings];

/**
 * Update a setting by name. Pick the helper matching the value's type; the C#
 * side resolves the property by name, persists it, and re-publishes SETTINGS.
 *
 * Note: int vs float can't be distinguished in TS (both `number`) — choose the
 * helper that matches the C# property type.
 */
export const setBoolSetting = (key: SettingKeyOf<boolean>, value: boolean) =>
    trigger(GROUP, "TRIGGER:SET_SETTING_BOOL", key, value);

export const setIntSetting = (key: SettingKeyOf<number>, value: number) =>
    trigger(GROUP, "TRIGGER:SET_SETTING_INT", key, value);

export const setFloatSetting = (key: SettingKeyOf<number>, value: number) =>
    trigger(GROUP, "TRIGGER:SET_SETTING_FLOAT", key, value);

export const setStringSetting = (key: SettingKeyOf<string>, value: string) =>
    trigger(GROUP, "TRIGGER:SET_SETTING_STRING", key, value);
