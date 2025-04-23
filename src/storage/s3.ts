import { getSecret } from 'astro:env/server'
import { AwsClient } from 'aws4fetch'

const accessKeyId = getSecret('AWS_KEY_ID')
const s3RegionName = getSecret('AWS_REGION_NAME')
const s3BucketName = getSecret('AWS_S3_BUCKET_NAME')
const secretAccessKey = getSecret('AWS_SECRET_ACCESS_KEY')

async function defineAws4Fetch(): Promise<AwsClient> {
    if (!accessKeyId || !secretAccessKey) {
      throw new Error(`AWS_KEY_ID OR AWS_SECRET_ACCESS_KEY environment variable(s) are not set.`)
    }
    return new AwsClient({
      service: 's3',
      accessKeyId,
      secretAccessKey,
      region: s3RegionName,
    })
  }

  function getS3URL({ Key }: { Key: string }) {
    if (!s3BucketName) {
      throw new Error(`AWS_S3_BUCKET_NAME environment variable(s) are not set.`)
    }
    return new URL(`/${Key}`, `https://${s3BucketName}.s3.${s3RegionName}.amazonaws.com`)
  }

  export async function getS3ObjectURL(Key: string) {
    try {
      const endpointUrl = getS3URL({ Key })
      endpointUrl.searchParams.set('X-Amz-Expires', '3600')
      const client = await defineAws4Fetch()
      const signedRequest = await client.sign(new Request(endpointUrl), { aws: { signQuery: true } })
      return signedRequest.url
    } catch (e: any) {
      const tmp = e.message || e.toString()
      console.log(tmp)
      return
    }
  }

  
  export async function uploadS3ObjectURL(file: { name: string; type: string }) {
    try {
      const Key = file.name
      const endpointUrl = getS3URL({ Key })
      endpointUrl.searchParams.set('X-Amz-Expires', '3600')
      const client = await defineAws4Fetch()
      const signedRequest = await client.sign(new Request(endpointUrl, { method: 'PUT', headers: { 'Content-Type': file.type } }), { method: 'PUT', aws: { signQuery: true } })
      return signedRequest.url
    } catch (e: any) {
      const tmp = e.message || e.toString()
      console.log(tmp)
      return
    }
  }
  