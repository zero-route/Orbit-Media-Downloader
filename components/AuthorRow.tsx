import SmartImage from "@/components/SmartImage";
import type { Author } from "@/lib/providers/types";

type Props = {
  author?: Author;
};

export default function AuthorRow({ author }: Props) {
  if (!author || (!author.name && !author.username)) {
    return null;
  }

  return (
    <div className="o-author">
      <div className="o-avatar">
        {author.avatarUrl ? (
          <SmartImage src={author.avatarUrl} className="o-avatar-img" />
        ) : null}
      </div>
      <div className="o-author-text">
        {author.name ? <strong>{author.name}</strong> : null}
        {author.username ? <span>@{author.username}</span> : null}
      </div>
    </div>
  );
}
