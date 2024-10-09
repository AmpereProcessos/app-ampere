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
export function renderPagesIcons({
  totalPages,
  activePage,
  selectPage,
  disabled,
}: {
  totalPages: number
  activePage: number
  selectPage: (page: number) => void
  disabled: boolean
}) {
  const MAX_RENDER = 5
  var pages: (number | string)[] = []
  if (totalPages <= MAX_RENDER) {
    pages = Array.from({ length: totalPages }, (v, i) => i + 1)
  } else {
    // If active page is around the middle of the total pages
    if (totalPages - activePage > 3 && activePage - 1 > 3) {
      pages = [1, '...', activePage - 1, activePage, activePage + 1, '...', totalPages]
    } else {
      // if active page is 3 elements from the total page
      if (activePage > 3 && totalPages - activePage < MAX_RENDER - 1)
        pages = [1, '...', ...Array.from({ length: MAX_RENDER }, (v, i) => i + totalPages - MAX_RENDER), totalPages]
      // else, if active page is 3 elements from 1
      else pages = [...Array.from({ length: MAX_RENDER }, (v, i) => i + 1), '...', totalPages]
    }
  }
  return pages.map((p) => (
    <button
      key={p}
      disabled={typeof p != 'number' || disabled}
      onClick={() => {
        if (typeof p != 'number') return
        return selectPage(p)
      }}
      className={`${
        activePage == p ? 'border-primary bg-primary text-secondary' : 'border-transparent text-primary hover:bg-primary/50'
      } min-h-8 min-w-8 max-w-10 lg:min-h-10 lg:min-w-10 h-8 max-h-10 w-8 rounded-full border text-xs font-medium lg:h-10 lg:w-10`}
    >
      {p}
    </button>
  ))
}
