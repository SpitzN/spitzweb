export interface ColorGroup {
  minHue: number;
  maxHue: number;
}

export interface ColorGroups {
  warm: ColorGroup;
  transition: ColorGroup;
  cool: ColorGroup;
}

export interface DesignPrinciple {
  subtitle: string;
  text: string;
  icon?: React.ComponentType;
}

export interface ColorDefinition {
  name: string;
  variable: string;
  hsl: string;
  hex: string;
  description?: string;
  backgroundColor: string;
  basedOn?: string;
  darkMode?: {
    hsl: string;
    hex: string;
    basedOn: string;
  };
}

export type CopyableColor = Pick<ColorDefinition, "variable" | "hsl" | "hex">;
