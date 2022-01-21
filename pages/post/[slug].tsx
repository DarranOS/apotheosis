import { GetStaticProps } from 'next'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'

interface IFormInput {
  _id: string
  name: string
  email: string
  comment: string
}
interface Props {
  post: Post
}

function Post({ post }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>()

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log('Step1')
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data)
        console.log('Helo')
        setSubmitted(true)
      })
      .catch((err) => {
        // console.log(err)
        setSubmitted(false)

        console.log('Help')
      })
  }

  return (
    <main className="max-w-7xl mx-auto">
      <Header />

      <div
        style={{
          background: `url(${urlFor(post.mainImage).url()})`,
          backgroundSize: 'cover',
        }}
        className="flex justify-between items-center  py-10 lg:py-20 h-full lg:h-full border-y border-red-700 xl:rounded-lg"
      >
        <div className="px-10 pt-36 pb-12 space-y-5  max-w-xl text-white drop-shadow-[0px_2px_1px_rgba(200,0,0,1)]">
          <h1 className=" text-6xl font-serif ">{post.title}</h1>

          <h2 className="text-3xl max-w-xl font-serif text-white">{post.description}</h2>
        </div>
      </div>

      {/* <img
        src={urlFor(post.mainImage).url()!}
        className="w-full h-100 object-cover"
        alt=""
      /> */}

      <article className="p-10">
        <div>
          <PortableText
            className=""
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1
                  className="text-2xl font-bold my-5 text-red-900 uppercase"
                  {...props}
                />
              ),
              h2: (props: any) => (
                <h2 className="text-2xl font-bold my-5 text-red-900" {...props} />
              ),
              h3: (props: any) => (
                <h3 className="text-xl font-bold my-5 text-red-900" {...props} />
              ),
              h4: (props: any) => <h4 className="font-bold mt-5 uppercase" {...props} />,
              li: ({ children }: any) => <li className="ml-4 list-disc">{children}</li>,
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue=500 hover:underline">
                  {children}
                </a>
              ),
              blockquote: (props: any) => (
                <div className="px-6 py-6 my-8 bg-red-100 rounded">
                  <p {...props} />
                </div>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-7xl my-5 mx-auto border border-red-900" />

      {submitted ? (
        <div className="flex flex-col my-10 bg-red-900 text-white max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold"> Thank you for submitting your thoughts</h3>
          <p>Once it's approved, it'll appear below.</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex px-10 flex-col max-w-7xl mx-auto mb-10"
        >
          <h3 className="text-sm text-red-900">
            What do you think? Balanced? Interesting?
          </h3>
          <h4 className="text-2xl">Leave a comment or question?</h4>
          <hr className="py-3 mt-2" />

          <input {...register('_id')} type="hidden" name="_id" value={post._id} />

          <label className="block mb-5" htmlFor="">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-red-900 outline-none focus:ring"
              placeholder="Your name"
              type="text"
            />
          </label>
          <label className="block mb-5" htmlFor="">
            <span className="text-gray-700">Email </span>
            <input
              {...register('email', { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-red-900 outline-none focus:ring"
              placeholder="Email"
              type="email"
            />
          </label>
          <label className="block mb-5" htmlFor="">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-red-900 outline-none focus:ring"
              placeholder="Comment"
              rows={8}
            />
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">-The Name field is required</span>
            )}
          </div>
          <div>
            {errors.email && (
              <span className="text-red-500">-The email field is required</span>
            )}
          </div>
          <div>
            {errors.comment && (
              <span className="text-red-500">-The comment field is required</span>
            )}
          </div>

          <input
            className="shadow bg-red-900 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
            type="submit"
          />
        </form>
      )}

      <div className="flex flex-col p-10 m-10 max-w-2xl mx-auto shadow-red-900 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-red-900"> {comment.name}:</span> {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
        _id,
        slug {
            current
        }
    }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `* [_type == "post" && slug.current == $slug][0] {
        _id,
        title, 
        author -> {
        name,
        image
      }, 
      'comments': * [
        _type == "comment" && 
        post._ref == ^._id &&
        approved == true
      ],
      description,
      mainImage,
      slug,
      body
      }`

  const post = await sanityClient.fetch(query, { slug: params?.slug })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  }
}
