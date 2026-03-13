import { Badge } from "@/components/ui/badge";

const PLATFORM_COLORS: Record<string, string> = {
  zhihu: "bg-blue-100 text-blue-800",
  weibo: "bg-red-100 text-red-800",
  wechat: "bg-green-100 text-green-800",
  xiaohongshu: "bg-pink-100 text-pink-800",
  douyin: "bg-purple-100 text-purple-800",
  baidu: "bg-sky-100 text-sky-800",
  baidu_wenku: "bg-sky-100 text-sky-800",
  baidu_tieba: "bg-sky-100 text-sky-800",
  baidu_zhidao: "bg-sky-100 text-sky-800",
  baidu_baike: "bg-sky-100 text-sky-800",
  google: "bg-amber-100 text-amber-800",
  bing: "bg-teal-100 text-teal-800",
};

export function PlatformBadge({ platform, name }: { platform: string; name: string }) {
  const colors = PLATFORM_COLORS[platform] ?? "bg-gray-100 text-gray-800";
  return (
    <Badge variant="outline" className={`${colors} border-0 font-medium`}>
      {name}
    </Badge>
  );
}
