import { Density } from "gameBindings";
import tokens from "layout.tokens.json";

const VANILLA_COLUMNS = 9;
const VANILLA_ROWS = 2;
const VANILLA_ITEM_REM = 72;
const VANILLA_ITEM_MARGIN = 2;
const COLUMN_CHROME_REM = 40;
const ROW_CHROME_REM = 16;
const SIDE_COLUMN_BASE_REM = tokens.sideColumnBaseRem;
const WIDESCREEN_PADDING_REM = tokens.widescreenPaddingRem;

// A line of `count` tiles spans the tiles plus the gaps *between* them
const lineSpanRem = (count: number, itemRem: number): number =>
    count * itemRem + Math.max(0, count - 1) * VANILLA_ITEM_MARGIN;

// Inverse of lineSpanRem: how many `itemRem` tiles fit into `spanRem` once the
// inter-tile gaps are paid for.
const fitCount = (spanRem: number, itemRem: number): number =>
    Math.max(
        1,
        Math.floor(
            (spanRem + VANILLA_ITEM_MARGIN) / (itemRem + VANILLA_ITEM_MARGIN),
        ),
    );

const VANILLA_WIDTH_REM =
    lineSpanRem(VANILLA_COLUMNS, VANILLA_ITEM_REM) + COLUMN_CHROME_REM;
const HEIGHT_REM = lineSpanRem(VANILLA_ROWS, VANILLA_ITEM_REM) + ROW_CHROME_REM;

// Medium/High tile sizes are shared with the SCSS density rules via the token
// file (body.amt__density_1 / _2); Low is vanilla, so it isn't overridden there.
export const DENSITY_ITEM_REM: Record<Density, number> = {
    [Density.Low]: VANILLA_ITEM_REM,
    [Density.Medium]: tokens.densityMediumItemRem,
    [Density.High]: tokens.densityHighItemRem,
};

const sideColumnRem = (fontScale: number): number =>
    SIDE_COLUMN_BASE_REM * (1 + (fontScale - 1) / 2);

export interface GridDimensions {
    columns: number;
    rows: number;
}

/**
 * Column/row counts for a tile size and the available area.
 */
export const computeGrid = (params: {
    itemRem: number;
    widescreen: boolean;
    viewportPx: number;
    fontScale: number;
    rem: number;
}): GridDimensions => {
    const { itemRem, widescreen, viewportPx, fontScale, rem } = params;

    const availWidthRem =
        widescreen && rem > 0
            ? viewportPx / rem - 2 * sideColumnRem(fontScale) - WIDESCREEN_PADDING_REM
            : VANILLA_WIDTH_REM;

    const columns = fitCount(availWidthRem - COLUMN_CHROME_REM, itemRem);
    const rows = fitCount(HEIGHT_REM - ROW_CHROME_REM, itemRem);

    return { columns, rows };
};
