import sanityClient from '@sanity/client';

export const client = sanityClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECTID,
    dataset: 'production',
    apiVersion: 'v1',
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    useCdn: false
});