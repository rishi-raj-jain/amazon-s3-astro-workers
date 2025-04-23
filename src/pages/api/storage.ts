import type { APIContext } from 'astro'
import { getS3ObjectURL, uploadS3ObjectURL } from '../../storage/s3'

// Define an asynchronous function named GET that accepts a request object.
export async function GET({ request }: APIContext) {
  // Extract the 'file' parameter from the request URL.
  const url = new URL(request.url)
  const file = url.searchParams.get('file')
  // Check if the 'file' parameter exists in the URL.
  if (file) {
    try {
      const filePublicURL = await getS3ObjectURL(file)
      // Return a response with the image's public URL and a 200 status code.
      return new Response(filePublicURL)
    } catch (error: any) {
      // If an error occurs, log the error message and return a response with a 500 status code.
      const message = error.message || error.toString()
      console.log(message)
      return new Response(message, { status: 500 })
    }
  }
  // If the 'file' parameter is not found in the URL, return a response with a 400 status code.
  return new Response('Invalid Request.', { status: 400 })
}

export async function POST({ request }: APIContext) {
    // Extract the 'file' parameter from the request URL.
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const name = url.searchParams.get('name')
    if (!type || !name) return new Response('Invalid Request.', {status:400})
    try {
      // Generate an accessible URL for the uploaded file
      // Use this url to perform a GET to this endpoint with file query param valued as below
      const publicUploadUrl = await uploadS3ObjectURL({ type, name })
      // Return a success response with a message
      return new Response(publicUploadUrl)
    } catch (error: any) {
      // If there was an error during the upload process, return a 403 response with the error message
      const message = error.message || error.toString()
      console.log(message)
      return new Response(message, { status: 500 })
    }
}