import { Block } from '@//app/dashboard/admin/design-system/components/ds-helpers';
import { FormField } from '@/components/shared/FormField';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const FormFieldDisplay = () => (
  <div className="space-y-8">
    <Block title="États">
      <div className="grid grid-cols-2 gap-6">
        <FormField label="Nom de la recette" htmlFor="title" required>
          <Input id="title" placeholder="Ex : Risotto champignons & thym" />
        </FormField>

        <FormField
          label="Temps de préparation"
          htmlFor="prep"
          description="En minutes"
        >
          <Input id="prep" type="number" placeholder="15" />
        </FormField>

        <FormField
          label="Email"
          htmlFor="email-error"
          error="Cette adresse email est déjà utilisée."
        >
          <Input
            id="email-error"
            type="email"
            defaultValue="marine@"
            className="border-bordeaux-400 focus-visible:ring-bordeaux-300"
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="desc"
          description="Courte présentation de la recette, affichée sur la card."
        >
          <Textarea
            id="desc"
            placeholder="Une recette familiale transmise de génération en génération…"
            rows={3}
          />
        </FormField>
      </div>
    </Block>

    <Block title="Dans un formulaire (exemple login)">
      <div className="border-neutre-100 mx-auto max-w-sm rounded-xl border bg-white p-6">
        <div className="flex flex-col gap-4">
          <FormField label="Email" htmlFor="login-email" required>
            <Input
              id="login-email"
              type="email"
              placeholder="vous@exemple.fr"
            />
          </FormField>
          <FormField label="Mot de passe" htmlFor="login-pwd" required>
            <Input id="login-pwd" type="password" placeholder="••••••••" />
          </FormField>
          <FormField
            label="Mot de passe"
            htmlFor="login-pwd-err"
            error="Mot de passe incorrect."
          >
            <Input
              id="login-pwd-err"
              type="password"
              defaultValue="wrongpass"
              className="border-bordeaux-400 focus-visible:ring-bordeaux-300"
            />
          </FormField>
        </div>
      </div>
    </Block>
  </div>
);
