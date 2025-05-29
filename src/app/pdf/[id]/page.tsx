// src/app/pdf/[id]/page.tsx
import PdfDetailClient from './PdfDetailClient'

interface PageProps {
  params: { id: string }
}

export default function PdfDetailPage({ params }: PageProps) {
  return <PdfDetailClient pdfId={params.id} />
}
