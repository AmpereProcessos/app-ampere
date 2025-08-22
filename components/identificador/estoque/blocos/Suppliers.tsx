import type { TMaterial, TMaterialSupplierDTO } from '@/utils/schemas/materials'
import { Truck } from 'lucide-react'
import { MaterialSuppliersHolder } from '../../almoxarifado/fornecedores/SuppliersMenu'
import type { TAuthSession } from '@/lib/authentication/types'

type MaterialSuppliersBlockProps = {
  session: TAuthSession
  infoHolder: TMaterial
  updateInfoHolder: (changes: Partial<TMaterial>) => void
}
function MaterialSuppliersBlock({ session, infoHolder, updateInfoHolder }: MaterialSuppliersBlockProps) {
  function handleAddSupplier(supplier: TMaterialSupplierDTO) {
    return updateInfoHolder({
      fornecedores: [...(infoHolder.fornecedores || []), { id: supplier._id, nome: supplier.nome, cores: supplier.cores }],
    })
  }
  function handleRemoveSupplier(supplierId: string) {
    return updateInfoHolder({
      fornecedores: infoHolder.fornecedores?.filter((c) => c.id !== supplierId) || [],
    })
  }
  return (
    <div className="flex w-full flex-col gap-3">
      <h1 className="flex w-fit items-center justify-start gap-2 rounded-lg bg-primary/20 px-4 py-1.5">
        <Truck className="min-w-4 min-h-4 h-4 w-4" />
        <h1 className="w-full text-start text-xs font-medium leading-none tracking-tight">FORNECEDORES</h1>
      </h1>
      <MaterialSuppliersHolder
        session={session}
        applicableSuppliersIds={infoHolder.fornecedores?.map((c) => c.id) || []}
        handleAddSupplier={handleAddSupplier}
        handleRemoveSupplier={handleRemoveSupplier}
      />
    </div>
  )
}

export default MaterialSuppliersBlock
