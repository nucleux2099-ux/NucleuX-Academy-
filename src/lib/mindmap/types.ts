export type MapEdgeRelation =
  | "causes"
  | "leads_to"
  | "therefore"
  | "differentiates"
  | "requires"
  | "part_of"
  | "example_of";

export type MindMapNode = {
  id: string;
  chunkId?: string;
  label: string;
  importance?: "A" | "B" | "C";
  emphasis?: 1 | 2 | 3;
};

export type MindMapEdge = {
  id: string;
  from: string;
  to: string;
  relation: MapEdgeRelation;
  label?: string;
};

export type MindMap = {
  topicId: string;
  createdAt: string;
  updatedAt: string;
  version: 1;
  status: "draft" | "final";
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  generatedFrom: {
    prestudy: boolean;
    aim: boolean;
    shoot: boolean;
    skin: boolean;
  };
  requiredEdits: number;
  userEditsCount: number;
};
