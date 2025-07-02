import { Input } from "@/components/input"
import { Field, FieldGroup, Label } from "@/components/fieldset"
import { Button } from "@/components/button"

export default function SettingsForm() {
  return (
    <form>
      <FieldGroup>
        <Field>
          <Label>Name</Label>
          <Input name="name" />
        </Field>
        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" />
        </Field>
        <Button type="submit">Save changes</Button>
      </FieldGroup>
    </form>
  )
}