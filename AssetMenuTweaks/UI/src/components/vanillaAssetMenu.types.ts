import type React from "react";
import type { FocusKey } from "cs2/ui";

export interface VanillaAssetMenuProps {
    focusKey?: FocusKey;
    className?: string;
    onClose: () => void;
}

export type VanillaAssetMenu = React.FC<VanillaAssetMenuProps>;
