import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../typings'

interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  console.log(posts)
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div
        style={{ background: 'url(/images/dragon.webp)', backgroundSize: 'cover' }}
        className="flex justify-between items-center border-y border-red-700 py-10 lg:py-20 h-full lg:h-full rounded-lg"
      >
        <div className="px-10 pt-36 pb-12 space-y-5  max-w-xl text-white drop-shadow-[0px_2px_1px_rgba(200,0,0,1)]">
          <h1 className=" text-6xl font-serif "> Apotheosis</h1>

          <h2 className="text-3xl max-w-xl font-serif text-white">
            Rules and tweaks for D
            <span className=" text-4xl text-red-700  drop-shadow-[0px_2px_1px_rgba(255,255,255,1)]">
              &
            </span>
            D 5e.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pt-2 md:pt-6 ">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="border rounded-lg group cursor-pointer overflow-hidden">
              <img
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()!}
                alt=""
              />{' '}
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-xl text-red-700 font-serif">{post.title}</p>
                  <p>Rules by {post.author.name}</p>
                </div>
                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt=""
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `* [_type == "post"] {
    _id,
    title, 
    author -> {
    name,
    image
  }, 
  descrition,
  mainImage,
  slug
  }`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}
