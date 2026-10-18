export default function ResultSkeleton() {
  return (
    <section className="o-result is-skeleton" aria-busy="true" aria-label="Memuat">
      <div className="o-stage-wrap">
        <div className="o-skel o-skel-stage" />
      </div>
      <div className="o-details">
        <div className="o-skel-row">
          <div className="o-skel o-skel-avatar" />
          <div className="o-skel-lines">
            <div className="o-skel o-skel-line" />
            <div className="o-skel o-skel-line is-short" />
          </div>
        </div>
        <div className="o-skel o-skel-block" />
        <div className="o-skel o-skel-block is-tall" />
        <div className="o-skel o-skel-button" />
      </div>
    </section>
  );
}
