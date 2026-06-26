import type React from "react";
import type { Entity, NumericProperty } from "cs2/bindings";

export interface VanillaAssetItem {
    entity: Entity;
    name: string;
    priority: number;
    icon: string;
    dlc: string | null;
    theme: string | null;
    locked: boolean;
    uiTag: string;
    unique: boolean;
    placed: boolean;
    highlight: boolean;
    constructionCost: NumericProperty | null;
}

export interface VanillaItemGridProps {
    className?: string;
    minRowCount?: number;
    maxRowCount?: number;
    columnCount?: number;
    items: VanillaAssetItem[];
    selectedItem: Entity;
    onSelectItem: (entity: Entity) => void;
}

export type VanillaAssetGridProps = Partial<VanillaItemGridProps>;

export type VanillaItemGrid = React.FC<VanillaItemGridProps>;

export type VanillaAssetGrid = React.FC<VanillaAssetGridProps>;
