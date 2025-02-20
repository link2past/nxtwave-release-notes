
export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ReleaseNote {
  id: string;
  title: string;
  description: string;
  datetime: string;
  category: "feature" | "bugfix" | "enhancement";
  tags: Tag[];
  labels: Label[];
  slug: string;
  media?: {
    type: "image" | "video";
    url: string;
  }[];
}

export const categoryColors = {
  feature: "bg-emerald-500 text-white",
  bugfix: "bg-red-500 text-white",
  enhancement: "bg-purple-500 text-white",
} as const;

export const categoryLabels = {
  feature: "Feature",
  bugfix: "Bug Fix",
  enhancement: "Enhancement",
} as const;
