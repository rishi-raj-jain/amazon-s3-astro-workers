import { defineConfig, envField } from 'astro/config'
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  env: {
    schema: {
      AWS_KEY_ID: envField.string({ context: 'server', access: 'secret', optional: false }),
      AWS_REGION_NAME: envField.string({ context: 'server', access: 'secret', optional: false }),
      AWS_S3_BUCKET_NAME: envField.string({ context: 'server', access: 'secret', optional: false }),
      AWS_SECRET_ACCESS_KEY: envField.string({ context: 'server', access: 'secret', optional: false }),
    }
  },
  adapter: cloudflare()
});
