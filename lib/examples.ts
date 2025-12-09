import { Node, Edge } from "@xyflow/react";

export interface WorkflowExample {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

export const examples: WorkflowExample[] = [
  {
    id: "text-to-image",
    name: "Text to Image",
    description: "Generate an image from a text prompt",
    nodes: [
      {
        id: "gen-1",
        type: "generateImage",
        position: { x: 100, y: 100 },
        data: {
          label: "Generate Image",
          prompt: "A cyberpunk city street at night with neon lights and rain reflections, photorealistic 8k",
        },
      },
    ],
    edges: [],
  },
  {
    id: "image-editing",
    name: "Image Editing",
    description: "Upload and modify an image",
    nodes: [
      {
        id: "upload-1",
        type: "imageUpload",
        position: { x: 100, y: 100 },
        data: { label: "Upload Image" },
      },
      {
        id: "edit-1",
        type: "editImage",
        position: { x: 500, y: 100 },
        data: {
          label: "Edit Image",
          prompt: "Make the image look like a oil painting by Van Gogh",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "upload-1",
        target: "edit-1",
      },
    ],
  },
  {
    id: "image-variation",
    name: "Image Variation",
    description: "Generate variation from input",
    nodes: [
      {
        id: "upload-var-1",
        type: "imageUpload",
        position: { x: 100, y: 100 },
        data: { label: "Reference Image" },
      },
      {
        id: "gen-var-1",
        type: "generateImage",
        position: { x: 500, y: 100 },
        data: {
          label: "Generate Variation",
          prompt: "A similar composition but in the style of Studio Ghibli anime",
        },
      },
    ],
    edges: [
      {
        id: "e2",
        source: "upload-var-1",
        target: "gen-var-1",
      },
    ],
  },
];
