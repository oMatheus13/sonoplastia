import { cursoConteudo, type CursoBlock } from "../data/cursoConteudo";

export type CursoAula = {
  id: string;
  title: string;
  chapterNumber: string;
  chapterTitle: string;
  blocks: CursoBlock[];
  code?: string;
  kind: "intro" | "topic";
};

const subheadingPattern = /^(\d+\.\d+)\s+-\s+(.+)$/;

function buildAulasForChapter(
  chapterNumber: string,
  chapterTitle: string,
  blocks: CursoBlock[]
): CursoAula[] {
  const aulas: CursoAula[] = [];
  let current: CursoAula | null = null;

  const flush = () => {
    if (current && current.blocks.length) {
      aulas.push(current);
    }
    current = null;
  };

  for (const block of blocks) {
    if (block.type === "subheading") {
      flush();
      const match = subheadingPattern.exec(block.text);
      const code = match?.[1];
      const title = match?.[2] ?? block.text;
      current = {
        id: code ?? `${chapterNumber}-${aulas.length + 1}`,
        title,
        chapterNumber,
        chapterTitle,
        blocks: [],
        code,
        kind: "topic",
      };
      continue;
    }

    if (!current) {
      current = {
        id: `${chapterNumber}-intro`,
        title: "Introdução do capítulo",
        chapterNumber,
        chapterTitle,
        blocks: [],
        kind: "intro",
      };
    }

    current.blocks.push(block);
  }

  flush();

  if (!aulas.length && blocks.length) {
    return [
      {
        id: `${chapterNumber}-intro`,
        title: "Capítulo completo",
        chapterNumber,
        chapterTitle,
        blocks,
        kind: "intro",
      },
    ];
  }

  return aulas;
}

export const cursoAulasByChapter: Record<string, CursoAula[]> = Object.fromEntries(
  cursoConteudo.map((chapter) => [
    chapter.number,
    buildAulasForChapter(chapter.number, chapter.title, chapter.blocks),
  ])
);

export const cursoAulas: CursoAula[] = Object.values(cursoAulasByChapter).flat();

export function getAulasForChapters(chapterNumbers: string[]) {
  return chapterNumbers.flatMap((number) => cursoAulasByChapter[number] ?? []);
}
