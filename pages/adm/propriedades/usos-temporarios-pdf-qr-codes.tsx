import LoadingPage from '@/components/utils/LoadingPage'
import { useProperties } from '@/utils/methods/query/properties'
import { Code } from 'lucide-react'
import { useSession } from '@/components/providers/SessionProvider'

function UsosTemporariosPdfQrCodes() {
  const { status } = useSession({ required: true })

  if (status !== 'authenticated') return <LoadingPage />
  return <QRCodesContent />
}

export default UsosTemporariosPdfQrCodes

function chunkArray<T>(arr: T[], size: number): T[][] {
  if (!arr) return []
  const result: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

// Helper to get border classes for each cell in a 4x4 grid
function getCellBorderClasses(index: number) {
  const row = Math.floor(index / 4)
  const col = index % 4
  let classes = ''

  // Always add right and bottom borders for all cells (including last col/row)
  classes += ' border-r-2 border-b-2'
  // Always add left and top border for all
  if (col === 0) classes += ' border-l-2'
  if (row === 0) classes += ' border-t-2'

  // Use a stronger color for grid separation
  classes += ' border-primary'
  return classes
}
function QRCodesContent() {
  const { data: properties } = useProperties({})
  if (!properties) {
    return (
      <div className="relative flex grow flex-col items-center justify-center bg-[#fff] p-6">
        <p>Carregando propriedades...</p>
      </div>
    )
  }

  const propertyChunks = chunkArray(properties, 16)

  return (
    <div className="relative flex grow flex-col items-center justify-center gap-8 bg-[#fff] p-6">
      {propertyChunks.map((chunk, idx) => (
        <div
          key={idx.toString()}
          className="mb-8 flex h-[1120px] w-[800px] flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg"
          style={{ pageBreakAfter: 'always' }}
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, cellIdx) => {
              const property = chunk[cellIdx]
              const borderClasses = getCellBorderClasses(cellIdx)
              if (property) {
                return (
                  <div
                    key={property.identificador || cellIdx}
                    className={'flex min-h-[150px] min-w-[120px] flex-col items-center justify-center gap-3 bg-gray-50 p-2 ' + borderClasses}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-center text-xs font-semibold">{property.nome}</div>
                      <div className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1">
                        <Code className="h-3 w-3" />
                        <p className="text-[0.7rem] font-bold text-primary">{property.identificador}</p>
                      </div>
                    </div>
                    {property.usoTemporarioLinkUrlQRCode ? (
                      <div
                        // @ts-ignore
                        dangerouslySetInnerHTML={{ __html: property.usoTemporarioLinkUrlQRCode }}
                        className="size-24"
                      />
                    ) : (
                      <div className="size-24 flex items-center justify-center text-xs text-gray-400">Sem QR Code</div>
                    )}
                  </div>
                )
              }
              // Empty cell for padding, keep borders for grid
              return (
                <div
                  key={`empty-${cellIdx.toString()}`}
                  className={'flex min-h-[150px] min-w-[120px] flex-col items-center justify-center bg-gray-50 p-2 opacity-0 ' + borderClasses}
                />
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
