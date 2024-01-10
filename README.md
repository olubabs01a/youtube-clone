# youtube-clone
A simplified video sharing platform

### References
- [googleapis/nodejs-pubsub](https://github.com/googleapis/nodejs-pubsub)
- [googleapis/nodejs-storage](https://github.com/googleapis/nodejs-storage)
- [Install the gcloud CLI](https://cloud.google.com/sdk/docs/install)
- [Google Cloud Region Picker](https://cloud.withgoogle.com/region-picker)
- [Hero Icons](https://heroicons.com/micro)
- [GCS CORS](https://cloud.google.com/storage/docs/using-cors#command-line)
- [Signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls)

### Future Improvements
1. Use Terraform to spin up GCP resources
1. Secure Configuration - limit hardcoded values
1. Failed conversion retry limit - UI/email alert?
1. Allow users to add title and description
1. Include video timestamp
1. Multi-video uploads
1. Add object lifecycle rules for storage buckets (make it trendy for a few hours - someone using an old url should see ew that's so last season)
1. Split config into global vs local to resolve duplicates? Add global util
1. Look into deployment manager configuration
1. Add monitoring
1. Allow non-persist after download (user can decide to remove their video and original)
1. Enable requester pays
1. See latest videos converted
1. Allow others to see your video for 24 hours
1. Allow user feedback - upvote, downvote, comments
1. Regenerate 360p - see your latest uploads
1. Jupyter Notebook to test conversion!!!
- They can sign-in with Google
- Upload a video to convert
- Decide one-time or join the feed
- Render converted video


Problem solving
- ffmpeg on container
- force divisible by 2
- firestore not available in central1 as single region (use next best us-west1)
- firebase-admin / functions peer issue (downgrade to v11.0.0)
- [add unresolved host for user photo URL](https://nextjs.org/docs/messages/next-image-unconfigured-host)