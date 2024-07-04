import { IconType } from 'react-icons/lib'
import { ProductItemCategories } from '../select-options'
import { TProductItem } from '../schemas/crm/kits.schema'
import { BsCart } from 'react-icons/bs'

export function renderIcon(icon: React.ComponentType | IconType) {
  const IconComponent = icon
  return <IconComponent />
}

export function renderProductCategoryIcon(category: TProductItem['categoria'], size: number | undefined = 12) {
  const CategoryInfo = ProductItemCategories.find((productCategory) => productCategory.value == category)
  if (!CategoryInfo) return <BsCart size={size} />
  return renderIcon(CategoryInfo.icon)
}
