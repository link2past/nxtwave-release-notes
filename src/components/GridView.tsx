
import { ReleaseNote } from "./ReleaseCard";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { format } from "date-fns";

interface GridViewProps {
  releases: ReleaseNote[];
}

export function GridView({ releases }: GridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {releases.map((release) => (
        <Card key={release.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg line-clamp-2">{release.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className={
                  release.category === "feature"
                    ? "bg-green-100 text-green-800"
                    : release.category === "bugfix"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }
              >
                {release.category}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {format(new Date(release.datetime), "PPP")}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">{release.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {release.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  style={{ borderColor: tag.color, color: tag.color }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
