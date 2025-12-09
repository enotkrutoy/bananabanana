import { create } from "zustand"
import type { Node, Edge } from "@xyflow/react"
import { generateImage, editImage } from "../services/geminiService"

interface WorkflowState {
  nodes: Node[]
  edges: Edge[]
  isRunning: boolean
  results: string[]
  addNode: (node: Node) => void
  updateNode: (nodeId: string, data: Record<string, unknown>) => void
  removeNode: (nodeId: string) => void
  removeEdge: (edgeId: string) => void
  removeEdgesToNode: (nodeId: string) => void
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setIsRunning: (running: boolean) => void
  addResult: (result: string) => void
  clearWorkflow: () => void
  loadWorkflow: (nodes: Node[], edges: Edge[]) => void
  executeNode: (nodeId: string) => Promise<void>
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  isRunning: false,
  results: [],

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)),
    })),

  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    })),

  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),

  removeEdgesToNode: (nodeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.target !== nodeId),
    })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setIsRunning: (running) => set({ isRunning: running }),
  addResult: (result) => set((state) => ({ results: [...state.results, result] })),

  clearWorkflow: () =>
    set({
      nodes: [],
      edges: [],
      results: [],
      isRunning: false,
    }),

  loadWorkflow: (nodes, edges) => 
    set({
      nodes,
      edges,
      results: [],
      isRunning: false
    }),

  executeNode: async (nodeId: string) => {
    const { nodes, edges, updateNode, addResult, addNode } = get()
    const node = nodes.find((n) => n.id === nodeId)

    if (!node) return

    updateNode(nodeId, { isProcessing: true, error: null })

    try {
      switch (node.type) {
        case "imageUpload":
          if (node.data.uploadedImage) {
            updateNode(nodeId, {
              isProcessing: false,
              output: node.data.uploadedImage,
            })
            addResult(`Uploaded: ${node.data.fileName || "image"}`)
          }
          break

        case "editImage":
          if (node.data.prompt) {
            // Get input images from connected nodes
            const inputImages = edges
              .filter((edge) => edge.target === nodeId)
              .map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source)
                return sourceNode?.data.output as string
              })
              .filter((output): output is string => Boolean(output))

            if (inputImages.length > 0) {
              const result = await editImage({
                images: inputImages,
                prompt: node.data.prompt as string,
              });

              if (result.success) {
                updateNode(nodeId, {
                  isProcessing: false,
                  output: result.imageUrl,
                  generatedImage: result.imageUrl,
                })
                addResult(`Edited image: ${node.data.prompt}`)
                
                // Add result node automatically
                const resultNodeId = `edited-result-${Date.now()}`;
                addNode({
                  id: resultNodeId,
                  type: "imageResult",
                  position: {
                    x: node.position.x + 400,
                    y: node.position.y,
                  },
                  data: {
                    label: "Edited Image",
                    imageUrl: result.imageUrl,
                    prompt: node.data.prompt,
                    description: result.description,
                    generatedAt: new Date().toLocaleTimeString(),
                    output: result.imageUrl,
                  },
                });
              }
            } else {
              throw new Error("No input images found for editing.")
            }
          }
          break

        case "generateImage":
          if (node.data.prompt) {
             // Get reference images if any
            const referenceImages = edges
              .filter((edge) => edge.target === nodeId)
              .map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source)
                return sourceNode?.data.output as string
              })
              .filter((output): output is string => Boolean(output));

            const result = await generateImage({
              prompt: node.data.prompt as string,
              inputImages: referenceImages.length > 0 ? referenceImages : undefined
            });

            if (result.success) {
              updateNode(nodeId, {
                isProcessing: false,
                output: result.imageUrl,
                generatedImage: result.imageUrl,
              })
              addResult(`Generated: ${node.data.prompt}`)

              // Add result node automatically
              const resultNodeId = `result-${Date.now()}`;
              addNode({
                id: resultNodeId,
                type: "imageResult",
                position: {
                  x: node.position.x + 400,
                  y: node.position.y,
                },
                data: {
                  label: "Generated Image",
                  imageUrl: result.imageUrl,
                  prompt: node.data.prompt,
                  description: result.description,
                  generatedAt: new Date().toLocaleTimeString(),
                  output: result.imageUrl,
                },
              });
            }
          }
          break
      }
    } catch (error) {
      updateNode(nodeId, {
        isProcessing: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  },
}))