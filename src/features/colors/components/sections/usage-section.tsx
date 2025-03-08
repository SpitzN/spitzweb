import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function UsageSection() {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Component Usage Examples</h2>
        <p className="text-muted-foreground">
          See how the Aurora color system seamlessly integrates with shadcn/ui components, providing
          consistent styling across different component types and states.
        </p>
      </div>

      <div className="grid gap-8">
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>
                  Different button styles using Aurora&apos;s semantic colors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <Button>Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                  <Button variant="destructive">Destructive Action</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button size="sm">Small</Button>
                  <Button>Default</Button>
                  <Button size="lg">Large</Button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button disabled>Disabled</Button>
                  <Button variant="secondary" disabled>
                    Disabled Secondary
                  </Button>
                  <Button variant="destructive" disabled>
                    Disabled Destructive
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alert Styles</CardTitle>
                <CardDescription>
                  Alert components utilizing Aurora&apos;s interactive state colors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Default Alert</AlertTitle>
                  <AlertDescription>This is a default alert using neutral colors.</AlertDescription>
                </Alert>

                <Alert className="border-aurora-info bg-aurora-info/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-aurora-info">Info Alert</AlertTitle>
                  <AlertDescription>An info alert using the default color scheme.</AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Alert</AlertTitle>
                  <AlertDescription>
                    This alert uses the destructive color for error states.
                  </AlertDescription>
                </Alert>

                <Alert className="border-aurora-success bg-aurora-success/10">
                  <CheckCircle2 className="h-4 w-4 text-aurora-success" />
                  <AlertTitle className="text-aurora-success">Success Alert</AlertTitle>
                  <AlertDescription>
                    A custom success alert using Aurora&apos;s success color.
                  </AlertDescription>
                </Alert>

                <Alert className="border-aurora-warning bg-aurora-warning/10">
                  <AlertTriangle className="h-4 w-4 text-aurora-warning" />
                  <AlertTitle className="text-aurora-warning">Warning Alert</AlertTitle>
                  <AlertDescription>
                    A custom warning alert using Aurora&apos;s warning color.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>
                  Form components styled with Aurora&apos;s color system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="default">Default Input</Label>
                  <Input id="default" placeholder="Enter your text" />
                </div>

                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" placeholder="Disabled input" disabled />
                </div>

                <div className="grid w-full max-w-sm gap-1.5">
                  <Label htmlFor="with-button" className="sr-only">
                    Input with Button
                  </Label>
                  <div className="flex gap-2">
                    <Input id="with-button" placeholder="Input with button" />
                    <Button>Submit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Badge Variants</CardTitle>
                <CardDescription>
                  Different badge styles using Aurora&apos;s color palette
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Badge>Default Badge</Badge>
                  <Badge variant="secondary">Secondary Badge</Badge>
                  <Badge variant="destructive">Destructive Badge</Badge>
                  <Badge variant="outline">Outline Badge</Badge>

                  <Badge className="bg-aurora-success hover:bg-aurora-success/80">
                    Success Badge
                  </Badge>
                  <Badge className="bg-aurora-warning hover:bg-aurora-warning/80">
                    Warning Badge
                  </Badge>
                  <Badge className="bg-aurora-info hover:bg-aurora-info/80">Info Badge</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="sliders" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sliders">Sliders</TabsTrigger>
            <TabsTrigger value="checkboxes">Checkboxes</TabsTrigger>
            <TabsTrigger value="selects">Selects</TabsTrigger>
            <TabsTrigger value="radio">Radio Groups</TabsTrigger>
            <TabsTrigger value="switches">Switches</TabsTrigger>
          </TabsList>

          <TabsContent value="sliders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Slider Components</CardTitle>
                <CardDescription>Interactive sliders with Aurora color accents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Slider</Label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Range Slider</Label>
                    <Slider defaultValue={[25, 75]} max={100} step={1} />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Disabled Slider</Label>
                    <Slider defaultValue={[50]} max={100} step={1} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkboxes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Checkbox Variations</CardTitle>
                <CardDescription>Checkbox components with different states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Default Checkbox</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="checked" defaultChecked />
                    <Label htmlFor="checked">Checked State</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="disabled" disabled />
                    <Label htmlFor="disabled">Disabled Checkbox</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="disabled-checked" disabled defaultChecked />
                    <Label htmlFor="disabled-checked">Disabled Checked</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="selects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Components</CardTitle>
                <CardDescription>Dropdown selects with various states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Select</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Disabled Select</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disabled" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="radio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Radio Groups</CardTitle>
                <CardDescription>Radio button groups with various states</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Default Radio Group</Label>
                  <RadioGroup defaultValue="option-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-1" id="option-1" />
                      <Label htmlFor="option-1">Option 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-2" id="option-2" />
                      <Label htmlFor="option-2">Option 2</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Disabled Radio Group</Label>
                  <RadioGroup defaultValue="disabled-1" disabled>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="disabled-1" id="disabled-1" />
                      <Label htmlFor="disabled-1">Disabled 1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="disabled-2" id="disabled-2" />
                      <Label htmlFor="disabled-2">Disabled 2</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="switches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Switch Components</CardTitle>
                <CardDescription>Toggle switches with different states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="default-switch" />
                    <Label htmlFor="default-switch">Default Switch</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="checked-switch" defaultChecked />
                    <Label htmlFor="checked-switch">Checked Switch</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="disabled-switch" disabled />
                    <Label htmlFor="disabled-switch">Disabled Switch</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="disabled-checked-switch" disabled defaultChecked />
                    <Label htmlFor="disabled-checked-switch">Disabled Checked</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The examples above demonstrate how Aurora&apos;s color system integrates with shadcn/ui
            components. The system provides:
          </p>

          <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
            <li>Consistent color application across different component types</li>
            <li>Semantic color usage that maintains meaning in both light and dark modes</li>
            <li>Custom color variants using Aurora&apos;s extended color palette</li>
            <li>Accessible color combinations that meet WCAG guidelines</li>
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
