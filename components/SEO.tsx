import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  url?: string
}

export default function SEO({ title, description, url }: SEOProps) {
  const siteName = 'Kisha WalletConnect'
  const metaTitle = title ? `${title} | ${siteName}` : siteName
  const metaDescription = description || 'Advanced Web3 dApp with WalletConnect integration'

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
    </Head>
  )
}
