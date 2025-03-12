import AsciiArt from "./AsciiArt";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    description: string;
    asciiArt: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border border-neutral-800 rounded-lg p-4 hover:border-neutral-600 transition-colors">
      <div className="h-40 mb-4 flex items-center justify-center">
        <AsciiArt type={project.asciiArt as any} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-neutral-300 text-sm">{project.description}</p>
    </div>
  );
}
