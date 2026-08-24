import { projectCatalog } from '../projectCatalog';
import { visionPositioningDetail } from './visionPositioning';
import { crowdSigmodDetail } from './crowdSigmod';
import { cixinSingularityDetail } from './cixinSingularity';
import { rlRacingDetail } from './rlRacing';
import { skyCloudDetail } from './skyCloud';
import { skyDouyinDetail } from './skyDouyin';
import { skyOjDetail } from './skyOj';

export const projectDetailById = {
  "vision-positioning": visionPositioningDetail,
  "crowd-sigmod": crowdSigmodDetail,
  "cixin-singularity": cixinSingularityDetail,
  "rl-racing": rlRacingDetail,
  "sky-cloud": skyCloudDetail,
  "sky-douyin": skyDouyinDetail,
  "sky-oj": skyOjDetail
};

export const projects = projectCatalog.map((summary) => ({
  ...summary,
  ...(projectDetailById[summary.id] || {})
}));

export const researchProjects = projects.filter((p) => p.type === "research");
export const engineeringProjects = projects.filter((p) => p.type === "engineering");

export {
  visionPositioningDetail,
  crowdSigmodDetail,
  cixinSingularityDetail,
  rlRacingDetail,
  skyCloudDetail,
  skyDouyinDetail,
  skyOjDetail
};

export default projects;
