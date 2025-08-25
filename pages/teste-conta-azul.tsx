import { Building2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { MDXEditor, MDXEditorMethods, headingsPlugin, listsPlugin, quotePlugin, thematicBreakPlugin, markdownShortcutPlugin } from '@mdxeditor/editor'
function TestingContaAzul() {
  const [infoHolder, setInfoHolder] = useState({
    contratanteTexto: '',
    contratadaTexto: '',
    clausulas: [],
    dataTexto: 'Ituiutaba/MG, 27 de Maio de 2025.',
  })

  return (
    <div className="bg-background relative flex grow items-center justify-center p-6">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <p className="text-sm font-medium">TEXTO DA CONTRATANTE</p>
        </div>
        <MDXEditor
          onChange={(e) => setInfoHolder((prev) => ({ ...prev, contratanteTexto: e }))}
          markdown={infoHolder.contratanteTexto}
          plugins={[headingsPlugin()]}
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <p className="text-sm font-medium">TEXTO DA CONTRATADA</p>
        </div>
        <MDXEditor
          onChange={(e) => setInfoHolder((prev) => ({ ...prev, contratadaTexto: e }))}
          markdown={infoHolder.contratadaTexto}
          plugins={[headingsPlugin()]}
        />
      </div>
    </div>
  )
}

export default TestingContaAzul
