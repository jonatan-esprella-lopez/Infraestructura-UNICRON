export interface PipelineStage {
  id: string;
  name: string;
  order: number;
}

export class Pipeline {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly stages: PipelineStage[],
  ) {}
}
