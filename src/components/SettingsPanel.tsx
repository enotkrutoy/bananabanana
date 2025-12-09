import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Settings } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-4 md:p-6 bg-card max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="touch-manipulation"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p className="font-medium mb-1">Model Capabilities:</p>
            <ul className="text-xs space-y-1">
              <li>• Image generation from text prompts</li>
              <li>• Multi-image editing and combining</li>
              <li>• Advanced vision understanding</li>
            </ul>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Configuration is managed via environment variables.
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 touch-manipulation"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}