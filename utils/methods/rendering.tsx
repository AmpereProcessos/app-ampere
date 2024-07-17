import { IconType } from 'react-icons/lib'
import { ProductItemCategories } from '../select-options'
import { TProductItem } from '../schemas/crm/kits.schema'
import { BsCart } from 'react-icons/bs'
import { fileTypes } from '../constants'
import { AiFillFile } from 'react-icons/ai'

export function renderIcon(icon: React.ComponentType | IconType) {
  const IconComponent = icon
  return <IconComponent />
}

export function renderProductCategoryIcon(category: TProductItem['categoria'], size: number | undefined = 12) {
  const CategoryInfo = ProductItemCategories.find((productCategory) => productCategory.value == category)
  if (!CategoryInfo) return <BsCart size={size} />
  return renderIcon(CategoryInfo.icon)
}

export function handleRenderFileIcon(format: string, size?: number) {
  //   useKey('Escape', () => setSelectMenuIsOpen(false))
  const extensionInfo = Object.values(fileTypes).find((f) => f.title == format)
  if (!extensionInfo)
    return (
      <div className="text-lg text-black">
        <AiFillFile />
      </div>
    )
  return <div className="text-lg text-black">{renderIcon(extensionInfo.icon)}</div>
}
