# Legal Document Compliance Checking System

A Full Stack system focused on legal contracts, where you can:

- **Upload your legal document**: Receive a detailed compliance report evaluating whether the clauses in your legal contract meet legal standards.
- **Ask your doubts**: Query specific clauses or details from the legal contract for further insights.

## Prerequisites

To run this project successfully, ensure you have the following:

1. **Amazon S3 Bucket**  
   Create an S3 bucket on [Amazon AWS](https://aws.amazon.com) to store uploaded PDFs.

2. **Pinecone Account**  
   Sign up for a Pinecone account to store embeddings of the legal clauses.

3. **MongoDB Cluster**  
   Set up a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) to store the names of the uploaded contract files.

4. **Google Cloud Project**  
   Create a Google Cloud project and enable the Gemini API. Generate API keys for:  
   - Embedding Model  
   - Completion Model  

   Use the Free tier of the Gemini API for embedding and completion services.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
