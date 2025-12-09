import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, Edit, Palette, X, LayoutTemplate } from "lucide-react";
import { useWorkflowStore } from "../stores/workflow-store";
import { examples } from "../lib/examples";

const nodeTypes = [
  {
    type: "imageUpload",
    label: "Image Upload",
    icon: Upload,
    description: "Upload images to start your workflow",
  },
  {
    type: "editImage",
    label: "Edit Image",
    icon: Edit,
    description: "Edit and combine multiple images with AI",
  },
  {
    type: "generateImage",
    label: "Generate Image",
    icon: Palette,
    description: "Generate new images from text prompts",
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps = {}) {
  const { loadWorkflow } = useWorkflowStore();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleLoadExample = (example: typeof examples[0]) => {
    loadWorkflow(example.nodes, example.edges);
    if (onClose) onClose();
  };

  return (
    <div className="w-64 md:w-64 bg-sidebar border-r border-sidebar-border p-4 h-full overflow-y-auto space-y-4">
      {onClose && (
        <div className="flex justify-end items-center mb-4 md:hidden">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-bold text-sidebar-foreground mb-1">
          Image Workflow
        </h1>
        <p className="text-xs text-sidebar-foreground/70">
          Visual AI Pipeline
        </p>
      </div>

      <div className="space-y-3 hidden md:block mb-6">
        <h2 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
          Nodes
        </h2>
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <Card
              key={nodeType.type}
              className="p-3 cursor-grab active:cursor-grabbing hover:bg-sidebar-accent transition-colors touch-manipulation"
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-sidebar-primary" />
                <div>
                  <div className="font-medium text-sidebar-foreground text-sm">
                    {nodeType.label}
                  </div>
                  <div className="text-xs text-sidebar-foreground/70">
                    {nodeType.description}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mb-6">
        <h2 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
          Examples
        </h2>
        <div className="space-y-2">
          {examples.map((example) => (
            <Button
              key={example.id}
              variant="outline"
              className="w-full justify-start h-auto py-2 px-3 text-left border-dashed border-sidebar-border hover:border-sidebar-primary/50"
              onClick={() => handleLoadExample(example)}
            >
              <LayoutTemplate className="w-4 h-4 mr-2 text-sidebar-foreground/50" />
              <div>
                <div className="font-medium text-xs text-sidebar-foreground">{example.name}</div>
                <div className="text-[10px] text-sidebar-foreground/60 line-clamp-1">
                  {example.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="text-sm text-sidebar-foreground/70 bg-background shadow-2xl rounded-xl p-3 border border-sidebar-border">
        <p className="font-medium mb-2">How to use:</p>
        <ol className="space-y-1 text-xs">
          <li>1. <b>Drag</b> components to canvas</li>
          <li className="hidden md:block">2. <b>Connect</b> nodes from dots</li>
          <li className="md:hidden">3. Tap output ports then input ports to connect</li>
          <li>4. Process nodes to generate/edit images</li>
        </ol>
      </div>
    </div>
  );
}