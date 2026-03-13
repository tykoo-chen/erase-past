import { TemplateLibrary } from "@/components/template-viewer";

export default function TemplatesPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-2">模板库</h1>
      <p className="text-muted-foreground mb-6">
        预置投诉模板，填入你的信息后可直接使用
      </p>
      <TemplateLibrary />
    </div>
  );
}
