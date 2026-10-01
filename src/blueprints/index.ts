import { ArticleBlueprint, CurrentAffairsBlueprint } from './current-affairs.blueprint.js';
import { RajasthanGKBlueprint } from './rajasthan-gk.blueprint.js';
import { ExamUpdateBlueprint } from './exam-update.blueprint.js';
import { StaticGKBlueprint } from './static-gk.blueprint.js';
import { StudyGuideBlueprint } from './study-guide.blueprint.js';

export * from './current-affairs.blueprint.js';
export * from './rajasthan-gk.blueprint.js';
export * from './exam-update.blueprint.js';
export * from './static-gk.blueprint.js';
export * from './study-guide.blueprint.js';

export function getBlueprint(type: string): ArticleBlueprint {
  switch (type.toUpperCase()) {
    case 'CURRENT_AFFAIRS':
      return CurrentAffairsBlueprint;
    case 'EXAM_UPDATE':
      return ExamUpdateBlueprint;
    case 'STATIC_GK':
      return StaticGKBlueprint;
    case 'STUDY_GUIDE':
      return StudyGuideBlueprint;
    case 'RAJASTHAN_GK':
    default:
      return RajasthanGKBlueprint;
  }
}
