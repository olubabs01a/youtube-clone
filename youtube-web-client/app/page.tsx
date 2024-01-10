import styles from "./page.module.css";
import { getAllVideos } from "./firebase/functions";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
	const videos = await getAllVideos();

	return (
		<main>
			{videos.map((video) => (
				<>
					<Link key={video.id} href={`/watch?v=${video.filename}`}>
						<Image
							src={`/thumbnail.png`}
							className={styles.thumbnail}
							alt="video"
							width={120}
							height={80}
						/>
					</Link>
					<div className={styles.description}>
						{video.title && <p>{video.title}</p>}
						{
							<p>
								Uploaded by: <i>{video.uid}</i>
							</p>
						}
					</div>
				</>
			))}
		</main>
	);
}

// Refresh page every 30 seconds
export const revalidate = 30;
