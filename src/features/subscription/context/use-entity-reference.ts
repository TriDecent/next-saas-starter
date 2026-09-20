'use client';

import { use } from 'react';
import { EntityReferenceContext } from './EntityReferenceContext';

export const useEntityReference = () => use(EntityReferenceContext);
