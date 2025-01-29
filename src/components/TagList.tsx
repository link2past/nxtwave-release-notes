interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TagListProps {
  tags: Tag[];
}

export function TagList({ tags }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="px-3 py-1 text-xs rounded-full transition-colors duration-200 hover:opacity-80"
          style={{ 
            backgroundColor: `${tag.color}20`, 
            color: tag.color,
            boxShadow: `0 1px 2px ${tag.color}10`
          }}
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}