import Link from 'next/link';
import { notFound } from 'next/navigation';
import { readDb } from '@/lib/cms';
import { Calendar, User, ArrowLeft, Award, Folder, Sparkles, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const db = readDb();

  const project = db.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = db.projects
    .filter((p) => p.id !== project.id)
    .slice(0, 3);

  const storyCards = [
    {
      title: 'Challenge',
      copy: project.description?.slice(0, 140) || 'A clear production brief focused on storytelling, visual fidelity, and interaction.'
    },
    {
      title: 'Execution',
      copy: `${project.tags?.slice(0, 3).join(' • ') || 'Immersive systems'} shaped the build with modular creative direction and polished delivery.`
    },
    {
      title: 'Outcome',
      copy: `${project.stats || 'High-impact launch'} delivered a cinematic experience that translated vision into a memorable digital product.`
    }
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-white font-sans relative pb-24">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-purple/20 blur-[180px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-blue/20 blur-[180px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-[105rem] mx-auto px-6 md:px-12 py-12 relative z-10 space-y-12">
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>

        <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/70 shadow-2xl min-h-[460px]">
            {project.video ? (
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-80"
              />
            ) : (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-neon-cyan">
                <Sparkles className="w-3.5 h-3.5" />
                {project.category}
              </div>
              <h1 className="mt-4 text-3xl md:text-5xl font-space font-black uppercase leading-none text-white">
                {project.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-300">
                {project.description}
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] border border-white/10 p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon-purple">Project Snapshot</p>
              <h2 className="text-2xl font-space font-black uppercase text-white">Built to feel premium, deliberate, and unforgettable.</h2>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <User className="w-4 h-4 text-neon-cyan" />
                  <span className="text-[10px] uppercase tracking-[0.24em]">Client</span>
                </div>
                <p className="mt-2 font-semibold text-white">{project.client}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-neon-purple" />
                  <span className="text-[10px] uppercase tracking-[0.24em]">Launch</span>
                </div>
                <p className="mt-2 font-semibold text-white">{project.year}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <Folder className="w-4 h-4 text-neon-blue" />
                  <span className="text-[10px] uppercase tracking-[0.24em]">Focus</span>
                </div>
                <p className="mt-2 font-semibold text-white">{project.category}</p>
              </div>
            </div>

            {project.stats && (
              <div className="rounded-2xl border border-neon-purple/20 bg-gradient-to-r from-neon-purple/15 to-neon-blue/15 p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gray-400">Performance metric</p>
                <p className="mt-2 text-2xl font-space font-black text-neon-cyan">{project.stats}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {(project.tags || []).slice(0, 6).map((tag, idx) => (
                <span key={`${tag}-${idx}`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {storyCards.map((card) => (
            <div key={card.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon-cyan">{card.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{card.copy}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 md:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon-purple">Approach</p>
            <h3 className="mt-3 text-2xl font-space font-black uppercase text-white">A tailored production system designed for impact.</h3>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Every deliverable combines art direction, spatial storytelling, and technical execution into one cohesive experience. The result is a project that feels both cinematic and functional from first impression to final interaction.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-all hover:bg-neon-purple/20"
            >
              Start a similar project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-8 md:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon-cyan">What made it stand out</p>
            <div className="mt-6 space-y-4">
              {[
                'High-fidelity visual systems with a polished, modern presentation.',
                'A clear narrative flow that guides attention without sacrificing clarity.',
                'Flexible creative production that adapts to the brief without losing precision.'
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Award className="mt-0.5 w-4 h-4 flex-shrink-0 text-neon-purple" />
                  <p className="text-sm leading-relaxed text-gray-400">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {relatedProjects.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon-cyan">More Work</p>
                <h3 className="mt-1 text-2xl font-space font-black uppercase text-white">Related Projects</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/projects/${rp.slug}`}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/50 p-6 h-72 transition-all hover:border-neon-purple/30"
                >
                  <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${rp.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="relative z-10 flex h-full flex-col justify-end">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neon-cyan">{rp.category}</p>
                    <h4 className="mt-2 text-lg font-space font-black uppercase text-white">{rp.name}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
