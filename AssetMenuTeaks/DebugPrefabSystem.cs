namespace AssetMenuTweaks {
    using Colossal.Serialization.Entities;

    using Game;
    using Game.Prefabs;

    using LucaModsCommon.Systems;

    /// <summary>
    /// FOR TESTING — bulk-generates filler assets so the asset menu is densely
    /// populated while iterating on the layout tweaks. Mirrors Platter's
    /// P_PrefabsCreateSystem approach: fetch a vanilla prefab via PrefabSystem,
    /// <see cref="PrefabBase.Clone"/> it, re-home the clone in the UI via its
    /// <see cref="UIObject"/>, and register it with <see cref="PrefabSystem.AddPrefab"/>.
    ///
    /// Produces:
    ///   * <see cref="ROAD_DUPLICATE_COUNT"/> Alley copies in the existing Small Roads tab.
    ///   * <see cref="CATEGORY_DUPLICATE_COUNT"/> new categories (tabs), each holding one Alley copy.
    /// </summary>
    public partial class AssetMenuTweaksDebugPrefabSystem : CommonGameSystemBase {
        private const int ROAD_DUPLICATE_COUNT = 80;
        private const int CATEGORY_DUPLICATE_COUNT = 10;

        private static readonly PrefabID AlleyPrefabId = new("RoadPrefab", "Alley");

        // Prefabs live in the global PrefabSystem for the whole app session, so
        // only install once even though the system is recreated per game load.
        private static bool s_Installed;

        private PrefabSystem m_PrefabSystem;

        /// <inheritdoc/>
        protected override void OnCreate() {
            base.OnCreate();
            m_PrefabSystem = World.GetOrCreateSystemManaged<PrefabSystem>();
        }

        /// <inheritdoc/>
        protected override void OnUpdate() { }

        /// <inheritdoc/>
        protected override void OnGamePreload(Purpose purpose, GameMode mode) {
            base.OnGamePreload(purpose, mode);
            if (!s_Installed) {
                Install();
            }
        }

        private void Install() {
            const string prefix = "Install() --";
            s_Installed = true;

            if (!m_PrefabSystem.TryGetPrefab(AlleyPrefabId, out var alleyBase)) {
                m_Log.Error($"{prefix} Could not find Alley prefab {AlleyPrefabId}; aborting.");
                return;
            }

            // The Alley's UIObject tells us which category (tab) it lives in — that's
            // the "Small Roads" category. Derive it rather than hardcoding the asset name.
            if (!alleyBase.TryGet<UIObject>(out var alleyUI) || alleyUI.m_Group is not UIAssetCategoryPrefab smallRoadsCategory) {
                m_Log.Error($"{prefix} Alley has no UIObject/category group; aborting.");
                return;
            }

            m_Log.Info($"{prefix} Source category resolved to '{smallRoadsCategory.name}'.");

            DuplicateAlleysIntoSmallRoads(alleyBase, alleyUI, smallRoadsCategory);
            DuplicateCategoriesWithOneAlley(alleyBase, smallRoadsCategory);

            m_Log.Info($"{prefix} Done — {ROAD_DUPLICATE_COUNT} alleys + {CATEGORY_DUPLICATE_COUNT} categories.");
        }

        /// <summary>Clones the Alley N times into its existing (Small Roads) tab.</summary>
        private void DuplicateAlleysIntoSmallRoads(PrefabBase alleyBase, UIObject alleyUI, UIAssetCategoryPrefab category) {
            for (var i = 1; i <= ROAD_DUPLICATE_COUNT; i++) {
                var clone = alleyBase.Clone($"AMT_Alley_{i}");

                if (clone.TryGet<UIObject>(out var cloneUI)) {
                    cloneUI.m_Group = category;                  // same tab as the original
                    cloneUI.m_Priority = alleyUI.m_Priority + i; // keep them ordered after it
                }

                if (!m_PrefabSystem.AddPrefab(clone)) {
                    m_Log.Warn($"DuplicateAlleys -- failed to add {clone.name}.");
                }
            }
        }

        /// <summary>Clones the Small Roads category N times, each populated with a single Alley copy.</summary>
        private void DuplicateCategoriesWithOneAlley(PrefabBase alleyBase, UIAssetCategoryPrefab sourceCategory) {
            var basePriority = sourceCategory.TryGet<UIObject>(out var srcCatUI) ? srcCatUI.m_Priority : 0;

            for (var t = 1; t <= CATEGORY_DUPLICATE_COUNT; t++) {
                // A cloned category starts empty — children reference a category via
                // their UIObject.m_Group, the category doesn't list its children.
                if (sourceCategory.Clone($"AMT_SmallRoads_{t}") is not UIAssetCategoryPrefab categoryClone) {
                    m_Log.Warn($"DuplicateCategories -- clone {t} was not a UIAssetCategoryPrefab; skipping.");
                    continue;
                }

                // m_Menu (the Roads toolbar menu) is copied by Clone, so the tab shows under Roads.
                if (categoryClone.TryGet<UIObject>(out var catUI)) {
                    catUI.m_Priority = basePriority + t;
                }

                if (!m_PrefabSystem.AddPrefab(categoryClone)) {
                    m_Log.Warn($"DuplicateCategories -- failed to add category {categoryClone.name}.");
                    continue;
                }

                var tabAlley = alleyBase.Clone($"AMT_TabAlley_{t}");
                if (tabAlley.TryGet<UIObject>(out var tabAlleyUI)) {
                    tabAlleyUI.m_Group = categoryClone; // the single asset in this new tab
                    tabAlleyUI.m_Priority = 0;
                }

                if (!m_PrefabSystem.AddPrefab(tabAlley)) {
                    m_Log.Warn($"DuplicateCategories -- failed to add {tabAlley.name}.");
                }
            }
        }
    }
}
