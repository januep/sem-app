// src/app/pdf/[id]/page.tsx
import PdfDetailClient from './PdfDetailClient'

export default async function PdfDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return <PdfDetailClient pdfId={id} />
}
