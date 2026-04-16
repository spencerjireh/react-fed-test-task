import { Helmet } from 'react-helmet-async';

type HeadProps = {
  title?: string;
  description?: string;
};

export function Head({ title = '', description = '' }: HeadProps) {
  return (
    <Helmet
      title={title ? `${title} | Pet Name Finder` : 'Pet Name Finder'}
      defaultTitle="Pet Name Finder"
    >
      <meta name="description" content={description} />
    </Helmet>
  );
}
