import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SearchInput } from '@/components/ui/search-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Stepper } from '@/components/ui/stepper';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export const FormsDisplay = () => (
  <div className="space-y-8">
    <Block title="Input — états">
      <div className="grid max-w-lg grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-neutre-500 text-xs">Défaut</p>
          <Input placeholder="Nom de la recette…" />
        </div>
        <div className="space-y-1">
          <p className="text-neutre-500 text-xs">Avec valeur</p>
          <Input defaultValue="Risotto champignons" />
        </div>
        <div className="space-y-1">
          <p className="text-neutre-500 text-xs">Désactivé</p>
          <Input disabled placeholder="Non modifiable" />
        </div>
        <div className="space-y-1">
          <p className="text-neutre-500 text-xs">Erreur</p>
          <Input
            className="border-bordeaux-400 focus-visible:ring-bordeaux-300"
            defaultValue="email-invalide"
          />
          <p className="text-bordeaux-500 text-xs">Format email invalide</p>
        </div>
      </div>
    </Block>

    <Block title="SearchInput — input avec icône loupe">
      <div className="max-w-sm">
        <SearchInput placeholder="Chercher une recette, un ingrédient…" />
      </div>
    </Block>

    <Block title="PasswordInput — toggle visibilité">
      <div className="max-w-sm">
        <PasswordInput placeholder="Mot de passe" />
      </div>
    </Block>

    <Block title="Stepper — sélecteur numérique +/−">
      <div className="flex flex-wrap items-center gap-6">
        <div className="space-y-1">
          <p className="text-neutre-500 text-xs">Portions (défaut 4)</p>
          <Stepper value={4} min={1} max={10} />
        </div>
        <div className="space-y-1">
          <p className="text-neutre-500 text-xs">Personnes (défaut 2)</p>
          <Stepper value={2} min={1} max={12} />
        </div>
      </div>
    </Block>

    <Block title="Textarea">
      <div className="max-w-sm">
        <Textarea placeholder="Notes personnelles sur la recette…" rows={3} />
      </div>
    </Block>

    <Block title="Select — dropdown">
      <div className="max-w-xs">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Catégorie de repas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="starter">Entrée</SelectItem>
            <SelectItem value="main">Plat principal</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
            <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Block>

    <Block title="Checkbox">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id="c1" />
          <Label htmlFor="c1">Champignons de Paris — 500 g</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c2" defaultChecked />
          <Label htmlFor="c2" className="text-neutre-400 line-through">
            Échalotes — 3 pcs
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c3" disabled />
          <Label htmlFor="c3" className="text-neutre-400">
            Désactivé
          </Label>
        </div>
      </div>
    </Block>

    <Block title="Switch — toggle on/off">
      <div className="flex flex-col gap-3">
        <div className="flex max-w-xs items-center justify-between">
          <Label>Rappel hebdomadaire</Label>
          <Switch defaultChecked />
        </div>
        <div className="flex max-w-xs items-center justify-between">
          <Label>Modifications du planning</Label>
          <Switch />
        </div>
        <div className="flex max-w-xs items-center justify-between">
          <Label className="text-neutre-400">Désactivé</Label>
          <Switch disabled />
        </div>
      </div>
    </Block>

    <Block title="RadioGroup — sélecteur de course (terracotta)">
      <RadioGroup defaultValue="main" className="flex gap-6">
        {[
          { value: 'starter', label: 'Entrée' },
          { value: 'main', label: 'Plat principal' },
          { value: 'dessert', label: 'Dessert' },
        ].map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <RadioGroupItem value={value} id={`course-${value}`} />
            <Label htmlFor={`course-${value}`}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    </Block>

    <Block title="OtpInput — vérification par code (6 cases)">
      <InputOTP maxLength={6} value="4792">
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p className="text-neutre-400 mt-2 text-xs">
        Case active → bordure terracotta · Chiffre saisi → Lora 20px
      </p>
    </Block>
  </div>
);
