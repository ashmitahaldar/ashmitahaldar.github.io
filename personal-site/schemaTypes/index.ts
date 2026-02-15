import profile from './profile'
import blogPost from './blogPost'
import skills from './skills'; 
import experience from './experience';
import education from './education';
import project from './project';
import resume from './resume';
import artPhoto from './artPhoto';

import dateRange from './dateRange';

export const schemaTypes = [
  // Personal Info
  profile,
  skills,
  
  // Portfolio Content
  experience,
  education,
  project,

  // Blog Content
  blogPost,
  artPhoto,

  // Documents
  resume,

  // Custom Object Types
  dateRange
];
