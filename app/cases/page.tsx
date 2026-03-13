import { CaseBoard } from "@/components/case-board";

export default function CasesPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">案例管理</h1>
      <CaseBoard />
    </div>
  );
}
