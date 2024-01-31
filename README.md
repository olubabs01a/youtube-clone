# youtube-clone
A simplified video sharing platform

#### Resources
- [googleapis/nodejs-pubsub](https://github.com/googleapis/nodejs-pubsub)
- [googleapis/nodejs-storage](https://github.com/googleapis/nodejs-storage)
- [Install the gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [Google Cloud Region Picker](https://cloud.withgoogle.com/region-picker)
- [Hero Icons](https://heroicons.com/micro)
- [GCS CORS](https://cloud.google.com/storage/docs/using-cors#command-line)
- [Signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls)

#### Problem solving
- ffmpeg on container
- force divisible by 2
- firestore not available in central1 as single region (use next best us-west1)
- firebase-admin / functions peer issue (downgrade to v11.0.0)
- [add unresolved host for user photo URL](https://nextjs.org/docs/messages/next-image-unconfigured-host)
- Refreshing content (use [time-based revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#time-based-revalidation))
- Docker build context canceled - [Reset config dir](https://stackoverflow.com/a/70881149)
