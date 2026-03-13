import { CaseDetail } from "@/components/case-detail";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <CaseDetail id={id} />
    </div>
  );
}
