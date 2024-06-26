import React from 'react';
import { Converter } from 'showdown';
import { Layout, Post } from '../../components';

export default function CodeRouteIndexPage({ posts = [] }) {
  return (
    <Layout siteTitle="jinyoung / code" pageTitle="code">
      <main id="code-page-description">
      <p><code>hackathon</code> : developed in collaboration.</p>
      {posts.map(({ title, date, stack, slug, hackathon, live_demo, projectSummary }) => (
        <Post 
          key={slug} 
          title={title} 
          date={date} 
          slug={slug} 
          hackathon={hackathon} 
          live_demo={live_demo}
          projectSummary={projectSummary}
          isCodeEntry
        >
          {stack}
        </Post>
      ))}
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  //posts refer to entries saved in root:/posts
  const posts = ((context) => {
    const keys = context.keys();
    const values = keys.map(context);

    const data = keys.map((key, index) => {
      const slug = key.replace(/^.*[\\/]/, '').slice(0, -3);
      const content = values[index];
      const converter = new Converter({ metadata: true });
      const body = converter.makeHtml(content.default);
      const projectSummary = body;
      const { title, date, stack, hackathon, live_demo } = converter.getMetadata();

      return {
        title,
        date,
        stack,
        slug,
        hackathon,
        live_demo,
        projectSummary,
      };
    });

    //this return is where thought posts are sorted according to latest to earliest:
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  })(require.context('../../../posts/code', true, /\.md$/));

  return {
    props: {
      posts,
    },
  };
}
