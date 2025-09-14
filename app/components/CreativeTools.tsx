"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Type, 
  Frame, 
  Sparkles, 
  Camera, 
  Vintage, 
  Briefcase, 
  Smartphone,
  Wand2,
  RotateCw,
  Move,
  Layers
} from 'lucide-react'
import { CREATIVE_EFFECTS, CREATIVE_CATEGORIES, BORDER_PRESETS, getEffectsByCategory } from '../constants/creativeTools'

interface CreativeToolsProps {
  onEffectChange: (effect: any) => void
  onTextOverlay: (text: any) => void
  onWatermark: (watermark: any) => void
  onBorder: (border: any) => void
  currentEffect?: string
}

export default function CreativeTools({ 
  onEffectChange, 
  onTextOverlay, 
  onWatermark, 
  onBorder,
  currentEffect 
}: CreativeToolsProps) {
  const [selectedCategory, setSelectedCategory] = useState('artistic')
  const [textSettings, setTextSettings] = useState({
    text: 'Sample Text',
    fontSize: 24,
    color: '#ffffff',
    x: 50,
    y: 50,
    fontFamily: 'Arial',
    fontWeight: 'normal' as const,
    opacity: 100,
    rotation: 0,
    shadow: true
  })
  
  const [watermarkSettings, setWatermarkSettings] = useState({
    type: 'text' as const,
    content: '© Your Brand',
    position: 'bottom-right' as const,
    opacity: 50,
    size: 16
  })
  
  const [borderSettings, setBorderSettings] = useState({
    type: 'solid' as const,
    width: 10,
    color: '#ffffff',
    opacity: 100,
    blur: 10
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'artistic': return <Palette className="w-4 h-4" />
      case 'vintage': return <Camera className="w-4 h-4" />
      case 'professional': return <Briefcase className="w-4 h-4" />
      case 'social': return <Smartphone className="w-4 h-4" />
      default: return <Sparkles className="w-4 h-4" />
    }
  }

  const applyEffect = (effectName: string) => {
    const effect = CREATIVE_EFFECTS[effectName]
    if (effect) {
      onEffectChange({
        name: effectName,
        ...effect.sharpConfig
      })
    }
  }

  const applyTextOverlay = () => {
    onTextOverlay({
      ...textSettings,
      opacity: textSettings.opacity / 100
    })
  }

  const applyWatermark = () => {
    onWatermark({
      ...watermarkSettings,
      opacity: watermarkSettings.opacity / 100
    })
  }

  const applyBorder = () => {
    onBorder({
      ...borderSettings,
      opacity: borderSettings.opacity / 100
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-600" />
          Creative Tools
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="effects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="effects" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Effects
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-1">
              <Type className="w-3 h-3" />
              Text
            </TabsTrigger>
            <TabsTrigger value="watermark" className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Watermark
            </TabsTrigger>
            <TabsTrigger value="borders" className="flex items-center gap-1">
              <Frame className="w-3 h-3" />
              Borders
            </TabsTrigger>
          </TabsList>

          {/* Creative Effects Tab */}
          <TabsContent value="effects" className="space-y-4">
            <div className="space-y-4">
              {/* Category Selection */}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(CREATIVE_CATEGORIES).map(([key, category]) => (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className="flex items-center gap-1"
                  >
                    {getCategoryIcon(key)}
                    {category.label}
                  </Button>
                ))}
              </div>

              {/* Effects Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getEffectsByCategory(selectedCategory).map((effect) => (
                  <Button
                    key={effect.name}
                    variant={currentEffect === effect.name ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                    onClick={() => applyEffect(effect.name)}
                  >
                    <span className="font-medium text-sm">{effect.label}</span>
                    <span className="text-xs text-gray-500 text-center">
                      {effect.description}
                    </span>
                  </Button>
                ))}
              </div>

              {/* Reset Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEffectChange({ name: 'none' })}
                className="w-full"
              >
                Reset Effects
              </Button>
            </div>
          </TabsContent>

          {/* Text Overlay Tab */}
          <TabsContent value="text" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Text Content</Label>
                  <Input
                    value={textSettings.text}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter your text"
                  />
                </div>
                <div>
                  <Label>Font Family</Label>
                  <Select 
                    value={textSettings.fontFamily} 
                    onValueChange={(value) => setTextSettings(prev => ({ ...prev, fontFamily: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times">Times New Roman</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Font Size: {textSettings.fontSize}px</Label>
                  <Slider
                    value={[textSettings.fontSize]}
                    onValueChange={(value) => setTextSettings(prev => ({ ...prev, fontSize: value[0] }))}
                    min={12}
                    max={72}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={textSettings.color}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>X Position: {textSettings.x}%</Label>
                  <Slider
                    value={[textSettings.x]}
                    onValueChange={(value) => setTextSettings(prev => ({ ...prev, x: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Y Position: {textSettings.y}%</Label>
                  <Slider
                    value={[textSettings.y]}
                    onValueChange={(value) => setTextSettings(prev => ({ ...prev, y: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Opacity: {textSettings.opacity}%</Label>
                  <Slider
                    value={[textSettings.opacity]}
                    onValueChange={(value) => setTextSettings(prev => ({ ...prev, opacity: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Rotation: {textSettings.rotation}°</Label>
                  <Slider
                    value={[textSettings.rotation]}
                    onValueChange={(value) => setTextSettings(prev => ({ ...prev, rotation: value[0] }))}
                    min={-180}
                    max={180}
                    step={1}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={textSettings.fontWeight === 'bold' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTextSettings(prev => ({ 
                    ...prev, 
                    fontWeight: prev.fontWeight === 'bold' ? 'normal' : 'bold' 
                  }))}
                >
                  Bold
                </Button>
                <Button
                  variant={textSettings.shadow ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTextSettings(prev => ({ ...prev, shadow: !prev.shadow }))}
                >
                  Shadow
                </Button>
              </div>

              <Button onClick={applyTextOverlay} className="w-full">
                <Type className="w-4 h-4 mr-2" />
                Apply Text Overlay
              </Button>
            </div>
          </TabsContent>

          {/* Watermark Tab */}
          <TabsContent value="watermark" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Watermark Type</Label>
                <Select 
                  value={watermarkSettings.type} 
                  onValueChange={(value: 'text' | 'image') => setWatermarkSettings(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Watermark</SelectItem>
                    <SelectItem value="image">Image Watermark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Content</Label>
                <Input
                  value={watermarkSettings.content}
                  onChange={(e) => setWatermarkSettings(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={watermarkSettings.type === 'text' ? 'Enter watermark text' : 'Image URL'}
                />
              </div>

              <div>
                <Label>Position</Label>
                <Select 
                  value={watermarkSettings.position} 
                  onValueChange={(value: any) => setWatermarkSettings(prev => ({ ...prev, position: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Opacity: {watermarkSettings.opacity}%</Label>
                  <Slider
                    value={[watermarkSettings.opacity]}
                    onValueChange={(value) => setWatermarkSettings(prev => ({ ...prev, opacity: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Size: {watermarkSettings.size}px</Label>
                  <Slider
                    value={[watermarkSettings.size]}
                    onValueChange={(value) => setWatermarkSettings(prev => ({ ...prev, size: value[0] }))}
                    min={8}
                    max={48}
                    step={1}
                  />
                </div>
              </div>

              <Button onClick={applyWatermark} className="w-full">
                <Layers className="w-4 h-4 mr-2" />
                Apply Watermark
              </Button>
            </div>
          </TabsContent>

          {/* Borders Tab */}
          <TabsContent value="borders" className="space-y-4">
            <div className="space-y-4">
              {/* Border Presets */}
              <div>
                <Label>Border Presets</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.entries(BORDER_PRESETS).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => setBorderSettings(preset)}
                      className="capitalize"
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Border Type</Label>
                <Select 
                  value={borderSettings.type} 
                  onValueChange={(value: any) => setBorderSettings(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="shadow">Drop Shadow</SelectItem>
                    <SelectItem value="vintage">Vintage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width: {borderSettings.width}px</Label>
                  <Slider
                    value={[borderSettings.width]}
                    onValueChange={(value) => setBorderSettings(prev => ({ ...prev, width: value[0] }))}
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input
                    type="color"
                    value={borderSettings.color}
                    onChange={(e) => setBorderSettings(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Opacity: {borderSettings.opacity}%</Label>
                  <Slider
                    value={[borderSettings.opacity]}
                    onValueChange={(value) => setBorderSettings(prev => ({ ...prev, opacity: value[0] }))}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
                {borderSettings.type === 'shadow' && (
                  <div>
                    <Label>Blur: {borderSettings.blur}px</Label>
                    <Slider
                      value={[borderSettings.blur || 10]}
                      onValueChange={(value) => setBorderSettings(prev => ({ ...prev, blur: value[0] }))}
                      min={0}
                      max={30}
                      step={1}
                    />
                  </div>
                )}
              </div>

              <Button onClick={applyBorder} className="w-full">
                <Frame className="w-4 h-4 mr-2" />
                Apply Border
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
