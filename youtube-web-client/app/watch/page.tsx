"use client";

import styles from "./page.module.css";

import { useSearchParams } from "next/navigation";
import { loadConfiguration } from "@configuration";

export default function Watch() {
	const videoSrc = useSearchParams().get("v");

  const config = loadConfiguration();
	const getStoragePrefix = config.isCloudEnabled
		? `https://storage.googleapis.com/${config.processedVideoBucketName}`
		: config.localProcessedVideoPath;

	return (
		<div className={styles.main}>
			{videoSrc && (
				<>
					<h4 className={styles.header}>Now playing: {videoSrc}</h4>
					<video src={`${getStoragePrefix}/${videoSrc}`} controls muted autoPlay />
				</>
			)}
		</div>
	);
}
