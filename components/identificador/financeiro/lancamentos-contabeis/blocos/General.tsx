import DateInput from "@/components/inputs/Date";
import TextInput from "@/components/inputs/Text";
import TextareaInput from "@/components/inputs/TextareaInput";
import ResponsiveDialogDrawerSection from "@/components/utils/ResponsiveDialogDrawerSection";
import { formatDateForInputValue, formatDateInputChange } from "@/utils/methods/shared";
import { TUseAccountingEntryState } from "@/utils/state/accounting-entry";
import { BookOpen } from "lucide-react";

type GeneralBlockProps = {
  entry: TUseAccountingEntryState["state"]["entry"];
  updateEntry: TUseAccountingEntryState["updateEntry"];
};

export default function GeneralBlock({ entry, updateEntry }: GeneralBlockProps) {
  return (
    <ResponsiveDialogDrawerSection
      sectionTitleText="INFORMAÇÕES GERAIS"
      sectionTitleIcon={<BookOpen size={15} />}
    >
      <TextInput
        label="TÍTULO"
        placeholder="Preencha o título do lançamento contábil..."
        value={entry.titulo}
        handleChange={(value) => updateEntry({ titulo: value })}
        width="100%"
      />
      <DateInput
        label="DATA DE COMPETÊNCIA"
        value={formatDateForInputValue(entry.dataCompetencia)}
        handleChange={(value) =>
          updateEntry({
            dataCompetencia: formatDateInputChange(value, "string") || entry.dataCompetencia,
          })
        }
        width="100%"
      />
      <TextareaInput
        label="ANOTAÇÕES"
        placeholder="Preencha observações úteis para o lançamento..."
        value={entry.anotacoes}
        handleChange={(value) => updateEntry({ anotacoes: value })}
      />
    </ResponsiveDialogDrawerSection>
  );
}
