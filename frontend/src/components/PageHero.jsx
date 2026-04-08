export default function PageHero({ title, description }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-cyan-400/15 via-blue-800/20 to-slate-900/50 p-8 shadow-[0_20px_80px_rgba(25,210,255,0.25)] md:p-12">
      <div className="pointer-events-none absolute -top-10 -right-10 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-blue-600/30 blur-3xl" />
      <h1 className="relative text-3xl font-semibold text-white md:text-5xl">
        {typeof title === "string" && title.includes("<span") ? (
          <span dangerouslySetInnerHTML={{ __html: title }} />
        ) : (
          title
        )}
      </h1>
      <p className="relative mt-5 max-w-3xl text-slate-100/85">{description}</p>
    </section>
  );
}
