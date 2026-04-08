export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="mb-3 text-sm tracking-[0.3em] text-cyan-300/90 uppercase">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-white md:text-4xl">
        {typeof title === "string" && title.includes("<span") ? (
          <span dangerouslySetInnerHTML={{ __html: title }} />
        ) : (
          title
        )}
      </h2>
      {description ? <p className="mt-4 text-slate-200/80">{description}</p> : null}
    </div>
  );
}
