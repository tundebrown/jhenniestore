import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { getWebPageBySlug } from '@/lib/actions/web-page.actions'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn, formatDateTime } from '@/lib/utils'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params
  const webPage = await getWebPageBySlug(slug)
  
  if (!webPage) {
    return { title: 'Page Not Found' }
  }
  
  return {
    title: webPage.title,
    description: webPage.content.substring(0, 160) + '...',
  }
}

export default async function WebPageDetailsPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const { slug } = params
  const webPage = await getWebPageBySlug(slug)

  if (!webPage) notFound()

  return (
    <article className="min-h-screen bg-gradient-to-b from-muted/20 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link 
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "pl-0 hover:pl-2 transition-all duration-200 group"
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
            Back to Home
          </Link>
        </nav>

        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {webPage.title}
          </h1>
          
          {/* Metadata */}
          {(webPage.createdAt || webPage.updatedAt) && (
            <div className="flex flex-wrap justify-center items-center gap-4 mt-6 text-sm text-muted-foreground">
              {webPage.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Published {formatDateTime(webPage.createdAt).dateOnly}</span>
                </div>
              )}
              {webPage.updatedAt && webPage.updatedAt !== webPage.createdAt && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {formatDateTime(webPage.updatedAt).dateOnly}</span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Content Section */}
        <section className="prose prose-lg md:prose-xl prose-headings:font-bold prose-headings:tracking-tight 
          prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4
          prose-code:bg-muted prose-code:rounded prose-code:px-1 prose-code:py-0.5
          prose-pre:bg-muted prose-pre:border prose-pre:border-border
          prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
          prose-ul:list-disc prose-ol:list-decimal prose-li:my-1
          max-w-none web-page-content">
          <ReactMarkdown
            components={{
              // Custom components for better styling
              h2: ({ node, ...props }) => (
                <h2 className="group scroll-m-20 pt-12 pb-4 first:pt-0 border-b border-border/40" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="scroll-m-20 pt-8 pb-3" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="rounded-r-lg my-6" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="my-6 rounded-lg border shadow-sm overflow-hidden">
                  <table className="w-full" {...props} />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th className="border-b bg-muted px-4 py-3 text-left font-bold" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="border-b px-4 py-3" {...props} />
              ),
            }}
          >
            {webPage.content}
          </ReactMarkdown>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <Link href="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
            </p>
            <Link 
              href="/"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex items-center gap-2"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </footer>
      </div>
    </article>
  )
}
