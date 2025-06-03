import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ModelSelectProps {
  models: string[];
  selected: string;
  onSelectChange: (model: string) => void;
}

export function ModelSelect({ models, selected, onSelectChange }: ModelSelectProps) {
  return (
    <Select value={selected} onValueChange={onSelectChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione um modelo" />
      </SelectTrigger>
      <SelectContent>
        {models.map(model => (
          <SelectItem key={model} value={model}>
            {model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 