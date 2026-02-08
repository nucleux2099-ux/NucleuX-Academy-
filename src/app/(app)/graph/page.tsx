"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  RefreshCw,
  Info,
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: "topic" | "concept" | "procedure" | "drug";
  x: number;
  y: number;
  connections: string[];
  status: "completed" | "in-progress" | "not-started";
}

const sampleNodes: GraphNode[] = [
  { id: "1", label: "Portal Hypertension", type: "topic", x: 50, y: 50, connections: ["2", "3", "4", "5"], status: "completed" },
  { id: "2", label: "Cirrhosis", type: "topic", x: 20, y: 30, connections: ["1", "6"], status: "completed" },
  { id: "3", label: "Ascites", type: "concept", x: 80, y: 30, connections: ["1", "7"], status: "in-progress" },
  { id: "4", label: "Varices", type: "concept", x: 30, y: 70, connections: ["1", "8"], status: "in-progress" },
  { id: "5", label: "TIPS", type: "procedure", x: 70, y: 70, connections: ["1", "4"], status: "not-started" },
  { id: "6", label: "Hepatitis", type: "topic", x: 10, y: 15, connections: ["2"], status: "completed" },
  { id: "7", label: "SBP", type: "concept", x: 90, y: 15, connections: ["3"], status: "not-started" },
  { id: "8", label: "Band Ligation", type: "procedure", x: 15, y: 85, connections: ["4"], status: "not-started" },
];

const nodeColors = {
  topic: { bg: "bg-[#5BB3B3]", border: "border-[#A78BFA]", text: "text-white" },
  concept: { bg: "bg-[#5BB3B3]", border: "border-[#22D3EE]", text: "text-white" },
  procedure: { bg: "bg-[#7BA69E]", border: "border-[#10B981]", text: "text-white" },
  drug: { bg: "bg-[#C9A86C]", border: "border-[#FBBF24]", text: "text-white" },
};

const statusStyles = {
  completed: "opacity-100 ring-2 ring-[#7BA69E]",
  "in-progress": "opacity-100 ring-2 ring-[#C9A86C]",
  "not-started": "opacity-60",
};

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNodes = sampleNodes.filter((node) =>
    node.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#E8E0D5]">Knowledge Graph</h1>
          <p className="text-[#A0B0BC]">Visualize connections between concepts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.06)] bg-[#364A5E] text-[#A0B0BC] hover:bg-[#3A4D5F]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.06)] bg-[#364A5E] text-[#A0B0BC] hover:bg-[#3A4D5F]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A0B0BC]" />
        <Input
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#364A5E] border-[rgba(255,255,255,0.06)] text-[#E8E0D5] placeholder:text-[#6B7280]"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        {Object.entries(nodeColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
            <span className="text-[#A0B0BC] capitalize">{type}</span>
          </div>
        ))}
        <div className="border-l border-[rgba(255,255,255,0.06)] pl-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6B7280] ring-2 ring-[#7BA69E]" />
            <span className="text-[#A0B0BC]">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6B7280] ring-2 ring-[#C9A86C]" />
            <span className="text-[#A0B0BC]">In Progress</span>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Graph Container */}
        <Card className="flex-1 bg-[#364A5E] border-[rgba(255,255,255,0.06)] relative overflow-hidden" style={{ height: "500px" }}>
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <Button
              variant="outline"
              size="sm"
              className="border-[rgba(255,255,255,0.06)] bg-[#3A4D5F]/80 text-[#A0B0BC] hover:bg-[#3A4D5F]"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-[rgba(255,255,255,0.06)] bg-[#3A4D5F]/80 text-[#A0B0BC] hover:bg-[#3A4D5F]"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="border-[rgba(255,255,255,0.06)] bg-[#3A4D5F]/80 text-[#A0B0BC] hover:bg-[#3A4D5F]">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Graph SVG */}
          <svg
            className="w-full h-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          >
            {/* Draw connections first */}
            {sampleNodes.map((node) =>
              node.connections.map((targetId) => {
                const target = sampleNodes.find((n) => n.id === targetId);
                if (!target) return null;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke="rgba(124, 58, 237, 0.3)"
                    strokeWidth="2"
                  />
                );
              })
            )}
          </svg>

          {/* Nodes as absolutely positioned elements */}
          {filteredNodes.map((node) => {
            const colors = nodeColors[node.type];
            return (
              <button
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-2 rounded-lg ${colors.bg} ${colors.border} ${statusStyles[node.status]} border-2 hover:scale-110 transition-transform cursor-pointer`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                onClick={() => setSelectedNode(node)}
              >
                <span className={`text-sm font-medium ${colors.text}`}>{node.label}</span>
              </button>
            );
          })}
        </Card>

        {/* Details Panel */}
        <Card className="w-80 hidden lg:block bg-[#364A5E] border-[rgba(255,255,255,0.06)] p-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <Badge
                  className={`${nodeColors[selectedNode.type].bg} ${nodeColors[selectedNode.type].text} mb-2 border-none`}
                >
                  {selectedNode.type}
                </Badge>
                <h3 className="text-xl font-bold text-[#E8E0D5]">{selectedNode.label}</h3>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#A0B0BC]">Status</p>
                <Badge
                  variant="outline"
                  className={
                    selectedNode.status === "completed"
                      ? "border-[#7BA69E] text-[#7BA69E]"
                      : selectedNode.status === "in-progress"
                      ? "border-[#C9A86C] text-[#C9A86C]"
                      : "border-[#6B7280] text-[#A0B0BC]"
                  }
                >
                  {selectedNode.status.replace("-", " ")}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-[#A0B0BC]">Connected to</p>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.connections.map((connId) => {
                    const connected = sampleNodes.find((n) => n.id === connId);
                    return connected ? (
                      <Badge
                        key={connId}
                        variant="outline"
                        className="border-[rgba(91,179,179,0.3)] text-[#A78BFA] cursor-pointer hover:bg-[rgba(91,179,179,0.15)]"
                        onClick={() => setSelectedNode(connected)}
                      >
                        {connected.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full bg-[#5BB3B3] hover:bg-[#4A9E9E] text-white shadow-lg shadow-[#5BB3B3]/20">
                  Study This Topic
                </Button>
                <Button variant="outline" className="w-full border-[rgba(255,255,255,0.06)] text-[#A0B0BC] hover:bg-[#3A4D5F]">
                  View in Library
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Info className="w-12 h-12 text-[#6B7280] mb-4" />
              <h3 className="text-lg font-medium text-[#E8E0D5] mb-2">Select a Node</h3>
              <p className="text-sm text-[#A0B0BC]">
                Click on any topic in the graph to see its details and connections
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)] p-4 text-center">
          <p className="text-3xl font-bold text-[#E8E0D5]">{sampleNodes.length}</p>
          <p className="text-sm text-[#A0B0BC]">Total Topics</p>
        </Card>
        <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)] p-4 text-center">
          <p className="text-3xl font-bold text-[#7BA69E]">
            {sampleNodes.filter((n) => n.status === "completed").length}
          </p>
          <p className="text-sm text-[#A0B0BC]">Completed</p>
        </Card>
        <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)] p-4 text-center">
          <p className="text-3xl font-bold text-[#C9A86C]">
            {sampleNodes.filter((n) => n.status === "in-progress").length}
          </p>
          <p className="text-sm text-[#A0B0BC]">In Progress</p>
        </Card>
        <Card className="bg-[#364A5E] border-[rgba(255,255,255,0.06)] p-4 text-center">
          <p className="text-3xl font-bold text-[#5BB3B3]">
            {sampleNodes.reduce((acc, n) => acc + n.connections.length, 0) / 2}
          </p>
          <p className="text-sm text-[#A0B0BC]">Connections</p>
        </Card>
      </div>
    </div>
  );
}
