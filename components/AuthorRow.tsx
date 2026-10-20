import SmartImage from "@/components/SmartImage";
import { ExternalIcon } from "@/components/icons/StatIcons";
import { profileUrlFor } from "@/lib/detect/profile";
import { formatCount } from "@/lib/text";
import type { Author, PlatformId } from "@/lib/providers/types";

type Props = {
  author?: Author;
  platform: PlatformId;
};

export default function AuthorRow({ author, platform }: Props) {
  if (!author || (!author.name && !author.username)) {
    return null;
  }

  const href = author.profileUrl ?? profileUrlFor(platform, author.username);

  const meta = [
    author.username ? `@${author.username}` : null,
    typeof author.followers === "number"
      ? `${formatCount(author.followers)} pengikut`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="o-profile-head">
      <div className="o-author">
        <div className="o-avatar">
          {author.avatarUrl ? (
            <SmartImage src={author.avatarUrl} className="o-avatar-img" />
          ) : null}
        </div>
        <div className="o-author-text">
          {author.name ? <strong>{author.name}</strong> : null}
          {meta ? <span>{meta}</span> : null}
        </div>
      </div>
      {href ? (
        <a
          className="o-visit"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalIcon size={20} />
          Kunjungi
        </a>
      ) : null}
    </div>
  );
}
