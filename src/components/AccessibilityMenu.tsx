import { useState, useEffect } from "react";
import { 
  Accessibility, 
  Plus, 
  Minus, 
  Sun, 
  Moon, 
  RotateCcw,
  Eye,
  X,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ColorMode = 'normal' | 'dark' | 'high-contrast' | 'protanopia' | 'deuteranopia' | 'tritanopia';

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(100);
  const [colorMode, setColorMode] = useState<ColorMode>('normal');
  const [isOpen, setIsOpen] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem('a11y-font-size');
    const savedColorMode = localStorage.getItem('a11y-color-mode');
    
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      document.documentElement.style.fontSize = `${parseInt(savedFontSize)}%`;
    }
    if (savedColorMode) {
      setColorMode(savedColorMode as ColorMode);
      applyColorMode(savedColorMode as ColorMode);
    }
  }, []);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('a11y-font-size', newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem('a11y-font-size', newSize.toString());
  };

  const applyColorMode = (mode: ColorMode) => {
    // Remove all color mode classes first
    document.documentElement.classList.remove(
      'dark', 
      'high-contrast', 
      'protanopia', 
      'deuteranopia', 
      'tritanopia'
    );

    // Apply new mode
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode !== 'normal') {
      document.documentElement.classList.add(mode);
    }
  };

  const changeColorMode = (mode: ColorMode) => {
    setColorMode(mode);
    applyColorMode(mode);
    localStorage.setItem('a11y-color-mode', mode);
  };

  const resetSettings = () => {
    setFontSize(100);
    setColorMode('normal');
    document.documentElement.style.fontSize = '100%';
    document.documentElement.classList.remove(
      'dark', 
      'high-contrast', 
      'protanopia', 
      'deuteranopia', 
      'tritanopia'
    );
    localStorage.removeItem('a11y-font-size');
    localStorage.removeItem('a11y-color-mode');
  };

  const colorModes = [
    { id: 'normal' as const, label: 'Normal', icon: Sun },
    { id: 'dark' as const, label: 'Dark Mode', icon: Moon },
    { id: 'high-contrast' as const, label: 'High Contrast', icon: Eye },
    { id: 'protanopia' as const, label: 'Protanopia', icon: Eye },
    { id: 'deuteranopia' as const, label: 'Deuteranopia', icon: Eye },
    { id: 'tritanopia' as const, label: 'Tritanopia', icon: Eye },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-primary/20 hover:border-primary"
          aria-label="Accessibility options"
        >
          <Accessibility className="h-4 w-4" />
          <span className="hidden sm:inline">Accessibility</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Accessibility className="h-4 w-4" />
          Accessibility Options
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Font Size Controls */}
        <div className="p-2">
          <p className="text-xs text-muted-foreground mb-2">Text Size: {fontSize}%</p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={decreaseFontSize}
              disabled={fontSize <= 80}
              className="flex-1"
            >
              <Minus className="h-4 w-4 mr-1" />
              A-
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={increaseFontSize}
              disabled={fontSize >= 150}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              A+
            </Button>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Color Mode Options */}
        <DropdownMenuLabel className="text-xs">Color Mode</DropdownMenuLabel>
        {colorModes.map((mode) => (
          <DropdownMenuItem
            key={mode.id}
            onClick={() => changeColorMode(mode.id)}
            className={colorMode === mode.id ? "bg-primary/10" : ""}
          >
            <mode.icon className="h-4 w-4 mr-2" />
            {mode.label}
            {colorMode === mode.id && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Reset Button */}
        <DropdownMenuItem onClick={resetSettings} className="text-destructive">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
