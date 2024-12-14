import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MacroFocus, MealPreferences } from "@/types/meal";

const MACRO_OPTIONS: MacroFocus[] = ["Protein", "Fat", "Carbs", "Balanced"];

interface MealPreferencesFormProps {
  preferences: MealPreferences;
  onPreferenceChange: (field: keyof MealPreferences, value: string | number) => void;
  disabled: boolean;
}

export const MealPreferencesForm = ({
  preferences,
  onPreferenceChange,
  disabled,
}: MealPreferencesFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="diet">Diet Type</Label>
        <Input
          id="diet"
          placeholder={
            !disabled
              ? "e.g., Keto, Vegan, Mediterranean..."
              : "No credits remaining. Please wait for reset."
          }
          value={preferences.diet}
          onChange={(e) => onPreferenceChange("diet", e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxCalories">Maximum Calories</Label>
        <Input
          id="maxCalories"
          type="number"
          placeholder="Enter max calories"
          value={preferences.maxCalories}
          onChange={(e) =>
            onPreferenceChange("maxCalories", parseInt(e.target.value))
          }
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="foodPreferences">Food Preferences</Label>
        <Textarea
          id="foodPreferences"
          placeholder="Enter preferred ingredients or cuisines"
          value={preferences.foodPreferences}
          onChange={(e) => onPreferenceChange("foodPreferences", e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="foodsToAvoid">Foods to Avoid</Label>
        <Textarea
          id="foodsToAvoid"
          placeholder="Enter ingredients to avoid"
          value={preferences.foodsToAvoid}
          onChange={(e) => onPreferenceChange("foodsToAvoid", e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="macroFocus">Macro Focus</Label>
        <Select
          value={preferences.macroFocus}
          onValueChange={(value) =>
            onPreferenceChange("macroFocus", value as MacroFocus)
          }
          disabled={disabled}
        >
          <SelectTrigger id="macroFocus">
            <SelectValue placeholder="Select macro focus" />
          </SelectTrigger>
          <SelectContent>
            {MACRO_OPTIONS.map((macro) => (
              <SelectItem key={macro} value={macro}>
                {macro}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxBudget">Maximum Budget ($)</Label>
        <Input
          id="maxBudget"
          type="number"
          placeholder="Enter max budget"
          value={preferences.maxBudget}
          onChange={(e) =>
            onPreferenceChange("maxBudget", parseInt(e.target.value))
          }
          disabled={disabled}
        />
      </div>
    </div>
  );
};